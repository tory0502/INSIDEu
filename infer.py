from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import torch

# 설정
base_model_path = "./llama-3-Korean-Bllossom-8B"
adapter_prompts = {
    "Empathy": {
        "path": "./empathy-final",
        "prompt": """당신은 공감(Empathy) 상담사입니다.\n목표: 내담자의 감정을 공감하고 이해하는 대화를 진행합니다.\n규칙:\n1) 존댓말 유지.\n2) 질문 금지.\n\n내담자: 요즘 너무 무기력하고 아무것도 하기 싫어요.\n상담사:"""
    },
    "Identification": {
        "path": "./identification-final",
        "prompt": """당신은 식별(Identification) 상담사입니다.\n목표: 내담자의 비합리적 생각을 알려주는 대화를 진행합니다.\n규칙:\n1) 질문 금지.\n2) 존댓말 유지.\n3) 내담자의 이야기에서 비합리적 생각을 알려주기.\n\n내담자: 요즘 너무 무기력하고 아무것도 하기 싫어요.\n상담사:"""
    },
    "Strategy": {
        "path": "./strategy-final",
        "prompt": """당신은 전략(Strategy) 상담사입니다.\n목표: 내담자의 고민에 대해 구체적이고 실질적인 해결 전략이나 조언을 제시합니다.\n규칙:\n1) 존댓말 유지.\n2) 질문 금지.\n3) 내담자의 상황에 맞는 구체적 전략, 실천 방안, 조언을 제시하기.\n\n내담자: 요즘 너무 무기력하고 아무것도 하기 싫어요.\n상담사:"""
    },
    "Reflection": {
        "path": "./reflection-final",
        "prompt": """당신은 반영(Reflection) 상담사입니다.\n목표: 내담자의 감정, 생각, 경험을 요약하거나 되짚어주는 대화를 진행합니다.\n규칙:\n1) 질문 금지.\n2) 존댓말 유지.\n3) 내담자의 감정, 생각, 경험을 요약하거나 되짚어주기.\n\n내담자: 요즘 너무 무기력하고 아무것도 하기 싫어요.\n상담사:"""
    },
    "Encouragement": {
        "path": "./encouragement-final",
        "prompt": """당신은 격려(Encouragement) 상담사입니다.\n목표: 내담자의 고민에 대해 격려하고 응원하는 대화를 진행합니다.\n규칙:\n1) 존댓말 유지.\n2) 질문 금지.\n\n내담자: 요즘 너무 무기력하고 아무것도 하기 싫어요.\n상담사:"""
    }
}

# tokenizer + base model 로드
tokenizer = AutoTokenizer.from_pretrained(base_model_path, use_fast=False)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_path,
    torch_dtype=torch.float16,
    device_map="auto"
)

# 추론 함수
def infer_with_adapter(base_model, adapter_path, prompt):
    model = PeftModel.from_pretrained(base_model, adapter_path, device_map="auto")
    model.eval()

    input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to(model.device)
    with torch.no_grad():
        output_ids = model.generate(
            input_ids,
            max_new_tokens=150,
            do_sample=True,
            top_p=0.9,
            temperature=0.7
        )
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return output_text.split("상담사:")[-1].strip()

# 각 agent에 대해 추론 실행
responses = {}
for agent, info in adapter_prompts.items():
    response = infer_with_adapter(base_model, info["path"], info["prompt"])
    responses[agent] = response

# 결과 출력
for agent, text in responses.items():
    print(f"\n🟩 {agent} Agent\n{text}")