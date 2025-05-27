from identification_infer import get_identification_reply
from encouragement_infer import get_encouragement_reply
from empathy_infer import get_empathy_reply
from reflection_infer import get_reflection_reply
from strategy_infer import get_strategy_reply
from token_counter import get_token_allocation
from detect_cognitive_distortion import detect_cognitive_distortion
import openai

user_message = "내 진로가 이게 맞는걸까? 나는 인공지능 전공이고 시대가 너무 격변하고 있어서 불안해. 이 진로로 대학원도 가고 싶은데, 내가 가는길이 맞나 싶다. 이 고민때문에 요즘 근심걱정이 많아.."
distortion = detect_cognitive_distortion(user_message)
token_allocation = get_token_allocation(distortion, total_tokens=1200)

# 1. 각 Agent의 답변 생성
id_reply = get_identification_reply(user_message, token_allocation["Identification (ID)"])
en_reply = get_encouragement_reply(user_message, token_allocation["Encouragement (EN)"])
e_reply  = get_empathy_reply(user_message, token_allocation["Empathy (E)"])
re_reply = get_reflection_reply(user_message, token_allocation["Reflection (RF)"])
st_reply = get_strategy_reply(user_message, token_allocation["Strategy (ST)"])

# 2. GPT API에 전달할 프롬프트 구성
gpt_prompt = f"""
아래는 5가지 상담사(Agent)의 답변입니다. 각 답변은 서로 다른 관점에서 작성되어 어색하거나 문맥상 맞지 않는 부분이 있을 수 있습니다.

이 다섯 문단의 어색한 부분, 문맥상 맞지 않는 부분을 자연스럽게 제거하고, 핵심 내용만을 조화롭게 통합하여 내담자에게 전달할 한 문단의 답변을 작성해주세요. 반드시 존댓말을 사용하세요.

[식별(Identification)]:
{id_reply}

[격려(Encouragement)]:
{en_reply}

[공감(Empathy)]:
{e_reply}

[반영(Reflection)]:
{re_reply}

[전략(Strategy)]:
{st_reply}
"""

# 3. OpenAI GPT API 호출 (openai>=1.0.0 방식)
client = openai.OpenAI(api_key="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")  # 환경변수나 안전한 방식으로 관리 권장

response = client.chat.completions.create(
    model="gpt-4",  # 또는 "gpt-3.5-turbo"
    messages=[
        {"role": "system", "content": "당신은 전문 상담사입니다. 여러 상담사 답변을 종합해 최적의 답변을 만들어주세요."},
        {"role": "user", "content": gpt_prompt}
    ],
    max_tokens=400,
    temperature=0.7,
)

final_reply = response.choices[0].message.content
print("\n===== 최종 GPT 조율 답변 =====\n")
print(final_reply)

