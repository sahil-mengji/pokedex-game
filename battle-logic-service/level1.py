import json
import random
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from models import BattleRequest, XPUpdateRequest, Move, Stats, Pokemon

router = APIRouter()

# Model for simulating battle between two Pokemon
class BattleSimRequest(BaseModel):
    user_pokemon: Pokemon
    trainer_pokemon: Pokemon

# Helper function to load Level 1 data from JSON file
def load_level1_data():
    try:
        with open("level1.json", "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error reading level 1 data: " + str(e))

@router.get("/level/1")
def get_level1():
    return load_level1_data()

@router.post("/simulate_battle/")
def simulate_battle(battle: BattleSimRequest):
    battle_log = []

    # Determine turn order
    turn_data = {
        "pokemon1": battle.user_pokemon.model_dump(),
        "pokemon2": battle.trainer_pokemon.model_dump()
    }
    try:
        turn_order_response = requests.post("http://localhost:8000/turn_order/", json=turn_data)
        if turn_order_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Turn order request failed")
        turn_order_data = turn_order_response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error determining turn order: " + str(e))

    # Determine which Pokemon goes first
    first_pokemon = battle.user_pokemon if turn_order_data["first"] == "pokemon1" else battle.trainer_pokemon
    second_pokemon = battle.trainer_pokemon if first_pokemon == battle.user_pokemon else battle.user_pokemon

    turn_counter = 0
    while battle.user_pokemon.current_hp > 0 and battle.trainer_pokemon.current_hp > 0:
        turn_counter += 1
        if turn_counter > 100:
            return {"battle_log": battle_log, "winner": "tie", "reason": "Turn limit reached"}

        for attacker, defender in [(first_pokemon, second_pokemon), (second_pokemon, first_pokemon)]:
            if attacker.current_hp <= 0:
                continue  # Skip turn if fainted

            move = attacker.moves[0] if attacker == battle.user_pokemon else random.choice(attacker.moves)

            calc_payload = {
                "attacker": attacker.model_dump(),
                "defender": defender.model_dump(),
                "move": move.model_dump()
            }
            try:
                damage_response = requests.post("http://localhost:8000/calculate_damage/", json=calc_payload)
                if damage_response.status_code != 200:
                    raise HTTPException(status_code=500, detail="Damage calculation request failed")
                damage_data = damage_response.json()
            except Exception as e:
                raise HTTPException(status_code=500, detail="Error calculating damage: " + str(e))
            
            damage = damage_data.get("damage", 0)
            defender.current_hp -= damage
            battle_log.append(f"{attacker.nickname} used {move.name}, dealing {damage} damage!")
            if defender.current_hp <= 0:
                battle_log.append(f"{defender.nickname} fainted!")
                return {"battle_log": battle_log, "winner": attacker.nickname}
    
    return {"battle_log": battle_log, "winner": "tie"}

@router.post("/level/1/battle")
def start_battle(battle: BattleRequest):
    data = load_level1_data()
    trainer_id = battle.trainer_id  # Ensure trainer_id is part of the request

    trainer = next((t for t in data.get("trainers", []) if t["trainer_id"] == trainer_id), None)
    if not trainer and trainer_id == data.get("boss", {}).get("trainer_id"):
        trainer = data["boss"]

    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer battle not found for level 1.")
    
    outcome = random.choice(["win", "lose"])
    return {
        "trainer_id": trainer_id,
        "opponent": trainer["name"],
        "outcome": outcome,
        "details": "This is a simulated battle outcome."
    }
