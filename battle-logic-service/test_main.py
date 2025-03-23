import requests

def test_calculate_damage_miss():
    url = "http://localhost:8000/calculate_damage/"
    payload = {
        "attacker": {
            "attack": 0,
            "defense": 0,
            "hp": 0,
            "speed": 0,
            "special_atk": 0,
            "special_def": 0,
            "types": ["string"]
        },
        "defender": {
            "attack": 0,
            "defense": 0,
            "hp": 0,
            "speed": 0,
            "special_atk": 0,
            "special_def": 0,
            "types": ["string"]
        },
        "move": {
            "name": "string",
            "power": 0,
            "accuracy": 0,
            "move_type": "string",
            "status_effect": "string",
            "effect_chance": 0
        }
    }
    
    response = requests.post(url, json=payload)
    data = response.json()
    print("Response:", data)
    
    # Given that accuracy is 0, the move should miss.
    assert data["result"] == "miss"
    assert data["damage"] == 0

if __name__ == "__main__":
    test_calculate_damage_miss()
