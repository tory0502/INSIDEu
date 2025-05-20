import json
import torch
from torch.utils.data import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments
from peft import get_peft_model, LoraConfig, TaskType

# === CONFIGURATION ===
MODEL_NAME = "llama-3-Korean-Bllossom-8B"  # 원하는 base 모델로 변경
JSON_PATH = "./data/classified_Empathy_Supervisor.json"  # 학습할 JSON 파일
OUTPUT_DIR = "./empathy_adapter"  # 결과 저장 폴더
MAX_LENGTH = 512

# === STEP 1: Dataset ===
class ChatOnlyCompletionDataset(Dataset):
    def __init__(self, json_path, tokenizer):
        with open(json_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)


        self.samples = [item["content"] for item in raw_data if item["content"].strip()]
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        text = self.samples[idx]
        tokens = self.tokenizer(
            text, truncation=True, padding="max_length", max_length=MAX_LENGTH, return_tensors="pt"
        )
        tokens = {k: v.squeeze(0) for k, v in tokens.items()}
        tokens["labels"] = tokens["input_ids"].clone()
        return tokens

# === STEP 2: Tokenizer and Model ===
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, device_map="auto", torch_dtype=torch.float16)

# === STEP 3: Apply LoRA ===
lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    lora_dropout=0.1,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)
model = get_peft_model(model, lora_config)

# === STEP 4: Training Preparation ===
dataset = ChatOnlyCompletionDataset(JSON_PATH, tokenizer)

training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=1,
    num_train_epochs=3,
    learning_rate=2e-5,
    logging_steps=10,
    save_strategy="epoch",
    fp16=True,
    optim="adamw_torch"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    tokenizer=tokenizer
)

# === STEP 5: Train ===
trainer.train()
model.save_pretrained(OUTPUT_DIR)
