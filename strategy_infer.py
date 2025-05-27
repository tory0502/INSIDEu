import torch, os
from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig
from peft import PeftModel

base_model_path = "llama-3-Korean-Bllossom-8B"
adapter_path    = "checkpoint-1113"
tokenizer_path  = base_model_path

_tokenizer = None
_model = None
_stop_token_id = None

def _load_model_and_tokenizer():
    global _tokenizer, _model, _stop_token_id
    if _tokenizer is not None and _model is not None and _stop_token_id is not None:
        return
    if not os.path.exists(tokenizer_path):
        raise ValueError(f"Tokenizer path does not exist: {tokenizer_path}")
    _tokenizer = AutoTokenizer.from_pretrained(
        tokenizer_path,
        use_fast=False,
        trust_remote_code=True
    )
    if _tokenizer.pad_token is None:
        _tokenizer.pad_token = _tokenizer.eos_token
    dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
    cfg = AutoConfig.from_pretrained(base_model_path)
    if getattr(cfg, "parallel_style", None) is None:
        cfg.parallel_style = "none"
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_path,
        config=cfg,
        torch_dtype=dtype,
        device_map="auto",
        trust_remote_code=True
    )
    _model = PeftModel.from_pretrained(base_model, adapter_path, device_map="auto")
    _model.eval()
    stop_token = "사용자:"
    _stop_token_id = _tokenizer.encode(stop_token, add_special_tokens=False)[0]

def process_incomplete_sentence(text):
    end_marks = ['.', '!', '?', '~', '다', '까', '요', '죠', '네', '요']
    text = text.replace('assistant', '').strip()
    sentences = []
    current = ""
    for char in text:
        current += char
        if char in ['.', '!', '?']:
            sentences.append(current.strip())
            current = ""
    if current:
        if not any(current.rstrip().endswith(mark) for mark in end_marks):
            if sentences:
                text = ' '.join(sentences)
            else:
                last_end = -1
                for mark in end_marks:
                    pos = text.rfind(mark)
                    if pos > last_end:
                        last_end = pos
                if last_end != -1:
                    text = text[:last_end + 1]
    return text.strip()

def get_strategy_reply(user_message: str, length: int=512) -> str:
    global _model
    """
    user_message: 사용자 입력(str)
    return: 상담사 reply(str)
    """
    _load_model_and_tokenizer()
    messages = [
        {"role": "system", "content": """당신은 전략(Strategy) 상담사'입니다.\n        목표: 내담자의 고민에 대해 구체적이고 실질적인 해결 전략이나 조언을 제시합니다.  \n        규칙: \n        1) 존댓말 유지.\n        2) 질문 금지.\n        3) 내담자의 상황에 맞는 구체적 전략, 실천 방안, 조언을 제시하기.\n        """},
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": ""}
    ]
    prompt = _tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = _tokenizer(prompt, return_tensors="pt")
    inputs = {k: v.to(_model.device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = _model.generate(
            **inputs,
            max_length=length,
            do_sample=True,
            top_p=0.9,
            pad_token_id=_tokenizer.eos_token_id,
            eos_token_id=_stop_token_id,
            repetition_penalty=1.15
        )
    reply = _tokenizer.decode(outputs[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
    reply = process_incomplete_sentence(reply)
    
    # --- 메모리 해제 코드 추가 ---
    del _model
    _model = None
    torch.cuda.empty_cache()
    # ---------------------------
    
    return reply