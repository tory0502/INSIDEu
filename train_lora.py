import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from datasets import load_dataset
from trl import SFTTrainer

# ==== Config ====
BASE_MODEL = "MLP-KTLim/llama-3-Korean-Bllossom-8B"
DATA_PATH = "../data/cbt_samples_empathic.jsonl"  # JSONL format: {instruction, input, output}
OUTPUT_DIR = "../adapters/empathic"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ==== Load tokenizer and model ====
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, device_map="auto", torch_dtype=torch.float16)

# ==== Apply LoRA ====
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj"],  # LLaMA 3 구조에 따라 수정 가능
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM
)

model = get_peft_model(model, lora_config)

# ==== Load dataset ====
dataset = load_dataset("json", data_files=DATA_PATH)["train"]

# ==== Define training arguments ====
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=5e-5,
    logging_dir="../logs",
    logging_steps=10,
    save_strategy="epoch",
    fp16=True,
    report_to="none"
)

# ==== Launch training ====
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    dataset_text_field="output",  # Text field to predict
    tokenizer=tokenizer,
    args=training_args,
    formatting_func=lambda e: f"Instruct: {e['instruction']}\nInput: {e['input']}\nOutput: {e['output']}"
)

trainer.train()
model.save_pretrained(OUTPUT_DIR)
