from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Example battle payload:
battle_payload = {
    "attacker": {
        "level": 5,
        "xp": 0,
        "xp_to_next": 100,
        "attack": 55,
        "defense": 40,
        "hp": 35,
        "speed": 90,
        "special_atk": 50,
        "special_def": 50,
        "types": ["Electric"]
    },
    "defender": {
        "level": 5,
        "xp": 0,
        "xp_to_next": 100,
        "attack": 52,
        "defense": 43,
        "hp": 39,
        "speed": 65,
        "special_atk": 60,
        "special_def": 50,
        "types": ["Fire"]
    },
    "move": {
        "name": "Thunderbolt",
        "power": 90,
        "accuracy": 1.0,         # Accuracy as a value between 0 and 1
        "move_type": "Electric",
        "status_effect": "paralyze",
        "effect_chance": 0.1,      # 10% chance
        "category": "special"      # Ensure this matches your model's field name
    }
}

# Send a POST request to the battle endpoint.
response = client.post("/calculate_damage/", json=battle_payload)

# Print the JSON response (battle results)
print(response.json())
