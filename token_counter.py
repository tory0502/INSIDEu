import pandas as pd

def get_token_allocation(distortion, total_tokens=1200, csv_path="cognitive_distortions_softmax.csv"):
    """
    distortion: 0~9의 숫자(str 또는 int)
    total_tokens: 전체 토큰 수
    csv_path: softmax csv 경로
    """
    df = pd.read_csv(csv_path)
    # distortion을 str로 변환하여 비교 (csv의 Distortion 컬럼이 str이므로)
    row = df[df['Distortion'] == distortion]
    if row.empty:
        raise ValueError(f"Distortion '{distortion}' not found in CSV.")
    # Agent별 softmax 값 추출
    agent_cols = ['Empathy (E)', 'Identification (ID)', 'Reflection (RF)', 'Strategy (ST)', 'Encouragement (EN)']
    softmax_values = row[agent_cols].values.flatten()
    # 토큰 분배
    token_allocation = {agent: int(round(val * total_tokens)) for agent, val in zip(agent_cols, softmax_values)}
    # 토큰 총합이 total_tokens와 다를 경우 보정
    diff = total_tokens - sum(token_allocation.values())
    if diff != 0:
        # 가장 큰 softmax 값을 가진 agent에 diff만큼 더해줌
        max_agent = max(token_allocation, key=lambda k: softmax_values[agent_cols.index(k)])
        token_allocation[max_agent] += diff
    return token_allocation

# 사용 예시 (입력은 0~9의 숫자)
allocation = get_token_allocation(0, total_tokens=1200)
print(allocation)
# 출력 예시: {'Empathy (E)': 233, 'Identification (ID)': 142, ...}
