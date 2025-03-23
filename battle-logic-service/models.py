from pydantic import BaseModel
from typing import List, Optional

class Stats(BaseModel):
    level: int = 1         # Starting level
    xp: int = 0            # Current experience points
    xp_to_next: int = 100  # XP required to level up (initial threshold)
    attack: float
    defense: float
    hp: float
    speed: float
    special_atk: float
    special_def: float
    types: Optional[List[str]] = None  # e.g., ["fire", "flying"]

class Move(BaseModel):
    name: str
    power: float
    accuracy: float
    move_type: str
    status_effect: Optional[str] = None
    effect_chance: Optional[float] = None

    @property
    def category(self) -> str:
        from utils import get_move_category
        return get_move_category(self.move_type)

class BattleRequest(BaseModel):
    attacker: Stats
    defender: Stats
    move: Move

# Model for experience update
class XPUpdateRequest(BaseModel):
    attacker: Stats
    xp_gained: int
