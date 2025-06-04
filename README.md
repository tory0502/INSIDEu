# YAICON INSIDEu
- ..
## 6th YAICON

### Introduction & Background
최근 직접 대면 상담에 대한 심리적 부담이나 거부감으로 인해, 비대면 방식의 상담 도구에 대한 수요가 증가하고 있으며 그 중에서도 상담 챗봇의 활용이 활발히 이루어지고 있다. 특히, 다양한 성격과 전문성을 지닌 Agent들이 협업하는 Multi Agent 시스템은 사용자에게 보다 폭넓은 상담을 제공할 수 있다는 점에서 주목받고 있다. 그러나 현재 개발된 대부분의 Multi Agent 상담 챗봇은 영어 또는 중국어를 기반으로 하고 있다. 이에 본 프로젝트는 한국어를 기반으로 한 Multi Agent 상담 챗봇을 구현하고자 한다.

### Pipeline
![image](https://github.com/user-attachments/assets/5525af4e-fb84-4230-93e7-5719e393b94b)

1. GPT zero-shot prompting으로 인지왜곡 분류
2. llama-3-Korean-bllossom-8B에 LoRA Adaptor를 추가해 학습된 5개의 Agent -> 인지왜곡에 맞는 Agent 선택하여 답변 생성

### Dataset
- MindCafe(https://www.mindcafe.co.kr/)에서 전문 답변 크롤링
- LoRA fine-tuning dataset

### Results
https://github.com/user-attachments/assets/70711c91-5fae-443b-8b8c-47c46c91213f

