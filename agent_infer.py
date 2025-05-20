from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch

# 1. Base 모델 로드
base_model_name = "llama-3-Korean-Bllossom-8B"
tokenizer = AutoTokenizer.from_pretrained(base_model_name)
model = AutoModelForCausalLM.from_pretrained(base_model_name)

# 2. 원하는 하나의 Adapter만 적용
model = PeftModel.from_pretrained(model, "./empathy_adapter")  # 예: 공감형 에이전트

# 3. 고민 입력 + 답변 생성
prompt = "고민: 요즘 너무 무기력하고 아무것도 하기 싫어요.\n답변:"
input_ids = tokenizer(prompt, return_tensors="pt").input_ids.cuda()
model = model.cuda()

output_ids = model.generate(input_ids, max_length=150)
print(tokenizer.decode(output_ids[0], skip_special_tokens=True))