from openai import OpenAI
import os

# API key
client = OpenAI(api_key="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")

# 인지왜곡 목록 (index 0~9)
distortion_list = {
    0: "All-or-Nothing Thinking : 상황을 극단적으로 흑백논리로 해석함. '완벽해야 해', '전부 아니면 아무것도 아냐' 식의 표현이 자주 등장함.",
    
    1: "Overgeneralization : 한 번의 부정적인 경험을 근거로 모든 상황에 일반화함. '항상', '절대', '매번', '나는 원래 그런 사람' 등의 과도한 일반화 표현이 특징.",
    
    2: "Mental Filter : 전체 맥락 중 부정적인 정보에만 집착하고 긍정적인 면은 무시함. 칭찬은 무시하고 비판만 강조하거나 부정적인 요소만 반복 언급하는 경우.",
    
    3: "Jumping to Conclusions : 충분한 근거 없이 단정짓거나 해석함. 상황에 대한 비약적 해석이나 막연한 추측이 드러나는 경우.",
    
    4: "Mind Reading : 상대가 나를 부정적으로 생각하고 있을 것이라고 추정함. '분명히 저 사람은 날 싫어할 거야'처럼 타인의 생각을 단정하는 표현.",
    
    5: "Fortune Telling : 미래가 반드시 부정적으로 흘러갈 것이라고 예측함. '어차피 또 실패할 거야', '내일도 망할 거야'와 같이 확신 없이 비관적인 미래 예측을 하는 경우.",
    
    6: "Emotional Reasoning : 감정이 곧 사실이라고 여김. '불안하니까 안 될 거야', '우울하니까 아무 의미 없어'처럼 감정을 현실 판단의 근거로 삼음.",
    
    7: "Should Statements : '나는 ~해야 해', '저 사람은 ~했어야 해'처럼 과도한 규범적 기대를 스스로나 타인에게 부여함. 강박적 언어 ('반드시', '당연히')가 자주 포함됨.",
    
    8: "Labeling and Mislabeling : 자신 또는 타인에게 부정적인 이름이나 고정된 평가를 부여함. '나는 실패자야', '쟤는 진짜 쓰레기야'처럼 전면적, 극단적 표현 사용.",
    
    9: "Personalization : 일어난 모든 일이 자신의 책임이라고 여김. '내가 잘못해서 이런 일이 생긴 거야', '내 탓이야'처럼 과도한 자책이 포함됨."
}

# 인지왜곡 판단 함수
def detect_cognitive_distortion(user_input: str):
    system_prompt = (
        "다음은 10가지 인지왜곡 유형입니다. 사용자의 입력을 읽고, "
        "가장 관련 있는 인지왜곡 index 번호(0~9)만 숫자로 출력하세요."
    )
    for i in range(10):
        system_prompt += f"\n{i}: {distortion_list[i]}"
    system_prompt += (
        "\n\n사용자 입력을 분석하여 가장 관련 있는 번호만 **숫자 하나로만 출력**하세요. "
        "그 외의 설명이나 텍스트는 출력하지 마세요."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"사용자 입력: {user_input}"}
            ],
            temperature=0.0,
        )

        output = response.choices[0].message.content.strip()

        if output.isdigit():
            index = int(output)
            if 0 <= index <= 9:
                print(f"✅ 인지왜곡 분류 결과: {index} - {distortion_list[index]}")
                return index
            else:
                print(f"⚠️ 범위를 벗어난 숫자입니다. 출력값: {output}")
                return None
        else:
            print(f"⚠️ 숫자 출력이 아님. 전체 응답: {output}")
            return None

    except Exception as e:
        print(f"❌ API 호출 중 오류 발생: {e}")
        return None


# 테스트 코드
if __name__ == "__main__":
    test_cases = [
        "요즘 뭐든지 잘 안 풀리는 것 같아요. 회사에서도 자꾸 실수하고, 그럴 때마다 ‘나는 진짜 형편없는 사람인가?’ 하는 생각이 들어요. 예전부터 늘 그랬던 것 같고, 앞으로도 잘 못할 것 같아요. 동료들도 아마 속으로 나를 무능하다고 생각할지도 몰라요. 이렇게 불안하고 자신감이 없는데 무슨 일을 해도 안 될 것 같아요."
    ]

    for i, case in enumerate(test_cases):
        print(f"\n🧪 테스트 {i+1}: {case}")
        print(detect_cognitive_distortion(case))