// src/Ground.js
import Phaser from "phaser";

export class Ground {
	constructor(scene, worldSize, gridSize) {
		this.scene = scene;
		this.worldSize = worldSize;
		this.gridSize = gridSize;

		this.createGround();
		this.addDecorations();
	}

	createGround() {
		// Create tilemap
		const map = this.scene.make.tilemap({
			tileWidth: this.gridSize,
			tileHeight: this.gridSize,
			width: this.worldSize.width / this.gridSize,
			height: this.worldSize.height / this.gridSize,
		});

		// Add the tileset image
		const tileset = map.addTilesetImage("tiles");

		// Create ground layer with base grass tiles
		this.groundLayer = map.createBlankLayer("ground", tileset);

		// Random terrain generation
		this.generateTerrain(map);

		// Create paths through the world
		this.createPaths(map);

		// Add collision for certain tiles
		this.addCollision();

		// Store map for future reference
		this.map = map;
	}

	generateTerrain(map) {
		// Use perlin noise or similar algorithm for natural-looking terrain
		// For now, using simplified approach with random patches

		// First, fill everything with grass (tile index 1)
		this.groundLayer.fill(1);

		// Create water areas
		this.createWaterBodies();

		// Create mountain/rock areas
		this.createMountains();

		// Add forest patches
		this.createForests();
	}

	createWaterBodies() {
		// Create a few water bodies (lakes, ponds)
		const numWaterBodies = Math.floor(this.worldSize.width / 800);

		for (let i = 0; i < numWaterBodies; i++) {
			const centerX = Phaser.Math.Between(
				10,
				this.worldSize.width / this.gridSize - 10
			);
			const centerY = Phaser.Math.Between(
				10,
				this.worldSize.height / this.gridSize - 10
			);
			const size = Phaser.Math.Between(5, 15);

			// Create irregular shape for water
			for (let y = centerY - size; y <= centerY + size; y++) {
				for (let x = centerX - size; x <= centerX + size; x++) {
					// Check if point is within map bounds
					if (x >= 0 && x < this.map.width && y >= 0 && y < this.map.height) {
						// Calculate distance from center (oval shape)
						const distance = Math.sqrt(
							Math.pow((x - centerX) / 1.5, 2) + Math.pow(y - centerY, 2)
						);

						// Add some randomness to the edges
						const randomFactor = Phaser.Math.FloatBetween(0.8, 1.2);

						if (distance < size * randomFactor) {
							// Water tile (index 7)
							this.groundLayer.putTileAt(7, x, y);

							// Add shore tiles around water edges
							if (distance > size * randomFactor - 1.5) {
								// Shore tile (index 8)
								this.groundLayer.putTileAt(8, x, y);
							}
						}
					}
				}
			}
		}
	}

	createMountains() {
		// Create mountain ranges
		const numMountainRanges = Math.floor(this.worldSize.width / 1000);

		for (let i = 0; i < numMountainRanges; i++) {
			const startX = Phaser.Math.Between(
				5,
				this.worldSize.width / this.gridSize - 20
			);
			const startY = Phaser.Math.Between(
				5,
				this.worldSize.height / this.gridSize - 20
			);
			const length = Phaser.Math.Between(10, 30);
			const direction = Phaser.Math.Between(0, 3); // 0: right, 1: down-right, 2: down, 3: down-left

			let currentX = startX;
			let currentY = startY;

			// Create mountain range following a path
			for (let j = 0; j < length; j++) {
				// Create a small mountain cluster at current position
				this.createMountainCluster(currentX, currentY);

				// Move along the range direction with some randomness
				switch (direction) {
					case 0:
						currentX += Phaser.Math.Between(1, 2);
						break;
					case 1:
						currentX += Phaser.Math.Between(1, 2);
						currentY += Phaser.Math.Between(1, 2);
						break;
					case 2:
						currentY += Phaser.Math.Between(1, 2);
						break;
					case 3:
						currentX -= Phaser.Math.Between(1, 2);
						currentY += Phaser.Math.Between(1, 2);
						break;
				}

				// Add some variation to avoid straight lines
				currentX += Phaser.Math.Between(-1, 1);
				currentY += Phaser.Math.Between(-1, 1);

				// Ensure we stay within map bounds
				currentX = Phaser.Math.Clamp(
					currentX,
					2,
					this.worldSize.width / this.gridSize - 2
				);
				currentY = Phaser.Math.Clamp(
					currentY,
					2,
					this.worldSize.height / this.gridSize - 2
				);
			}
		}
	}

	createMountainCluster(centerX, centerY) {
		// Create a small cluster of mountain tiles
		const size = Phaser.Math.Between(2, 4);

		for (let y = centerY - size; y <= centerY + size; y++) {
			for (let x = centerX - size; x <= centerX + size; x++) {
				// Check if point is within map bounds
				if (x >= 0 && x < this.map.width && y >= 0 && y < this.map.height) {
					// Calculate distance from center
					const distance = Math.sqrt(
						Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
					);

					if (distance < size) {
						// Mountain tile (index 3 or 4)
						const mountainTile = distance < size / 2 ? 4 : 3;

						// Only place mountain on grass, not on water
						const currentTile = this.groundLayer.getTileAt(x, y);
						if (currentTile && currentTile.index === 1) {
							this.groundLayer.putTileAt(mountainTile, x, y);
						}
					}
				}
			}
		}
	}

	createForests() {
		// Create several forest patches
		const numForests = Math.floor(this.worldSize.width / 400);

		for (let i = 0; i < numForests; i++) {
			const centerX = Phaser.Math.Between(
				10,
				this.worldSize.width / this.gridSize - 10
			);
			const centerY = Phaser.Math.Between(
				10,
				this.worldSize.height / this.gridSize - 10
			);
			const size = Phaser.Math.Between(8, 20);

			// Create irregular forest patch
			for (let y = centerY - size; y <= centerY + size; y++) {
				for (let x = centerX - size; x <= centerX + size; x++) {
					// Check if point is within map bounds
					if (x >= 0 && x < this.map.width && y >= 0 && y < this.map.height) {
						// Calculate distance from center with noise for natural edges
						const distance = Math.sqrt(
							Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
						);

						const noise = Phaser.Math.FloatBetween(0.7, 1.3);

						if (distance < size * noise) {
							// Only place trees on grass, not on water or mountains
							const currentTile = this.groundLayer.getTileAt(x, y);
							if (currentTile && currentTile.index === 1) {
								// Tree tile (index 5 or 6)
								const treeDensity = Phaser.Math.FloatBetween(0, 1);

								if (treeDensity < 0.7) {
									// 70% chance of tree
									const treeType = Phaser.Math.Between(5, 6);
									this.groundLayer.putTileAt(treeType, x, y);
								}
							}
						}
					}
				}
			}
		}
	}

	createPaths(map) {
		// Create paths connecting different areas
		const numPaths = Math.floor(this.worldSize.width / 500);

		for (let i = 0; i < numPaths; i++) {
			// Select two random points on the map
			const startX = Phaser.Math.Between(
				5,
				this.worldSize.width / this.gridSize - 5
			);
			const startY = Phaser.Math.Between(
				5,
				this.worldSize.height / this.gridSize - 5
			);
			const endX = Phaser.Math.Between(
				5,
				this.worldSize.width / this.gridSize - 5
			);
			const endY = Phaser.Math.Between(
				5,
				this.worldSize.height / this.gridSize - 5
			);

			// Simple path-finding algorithm (improved A*)
			this.createPath(startX, startY, endX, endY);
		}
	}

	createPath(startX, startY, endX, endY) {
		// Simple implementation to create a winding path between two points
		let currentX = startX;
		let currentY = startY;

		// Path tile index (2)
		const pathTile = 2;

		// Create path with A* approach
		while (currentX !== endX || currentY !== endY) {
			// Place path tile
			this.groundLayer.putTileAt(pathTile, currentX, currentY);

			// Move towards destination with some randomness
			const diffX = endX - currentX;
			const diffY = endY - currentY;

			// Determine which direction to move
			if (Math.abs(diffX) > Math.abs(diffY)) {
				// Move horizontally
				currentX += diffX > 0 ? 1 : -1;

				// Sometimes add vertical movement for more natural paths
				if (Phaser.Math.FloatBetween(0, 1) < 0.2) {
					currentY += diffY > 0 ? 1 : diffY < 0 ? -1 : 0;
				}
			} else {
				// Move vertically
				currentY += diffY > 0 ? 1 : -1;

				// Sometimes add horizontal movement for more natural paths
				if (Phaser.Math.FloatBetween(0, 1) < 0.2) {
					currentX += diffX > 0 ? 1 : diffX < 0 ? -1 : 0;
				}
			}

			// Add some randomness for winding paths
			if (Phaser.Math.FloatBetween(0, 1) < 0.15) {
				currentX += Phaser.Math.Between(-1, 1);
				currentY += Phaser.Math.Between(-1, 1);
			}

			// Ensure we stay within map bounds
			currentX = Phaser.Math.Clamp(currentX, 0, this.map.width - 1);
			currentY = Phaser.Math.Clamp(currentY, 0, this.map.height - 1);

			// Prevent infinite loops - if too close, just go direct
			if (Math.abs(currentX - endX) <= 2 && Math.abs(currentY - endY) <= 2) {
				currentX = endX;
				currentY = endY;
			}
		}

		// Place final path tile at destination
		this.groundLayer.putTileAt(pathTile, endX, endY);
	}

	addDecorations() {
		// Add random decorative elements throughout the map
		const numDecorations = Math.floor(
			(this.worldSize.width * this.worldSize.height) / 40000
		);

		for (let i = 0; i < numDecorations; i++) {
			const x = Phaser.Math.Between(0, this.map.width - 1);
			const y = Phaser.Math.Between(0, this.map.height - 1);

			// Only place decorations on grass
			const currentTile = this.groundLayer.getTileAt(x, y);
			if (currentTile && currentTile.index === 1) {
				// Decoration tile (index 9-15)
				const decorTile = Phaser.Math.Between(9, 15);
				this.groundLayer.putTileAt(decorTile, x, y);
			}
		}

		// Add special locations (like Pokémon Centers, Gyms, etc.)
		this.addSpecialLocations();
	}

	addSpecialLocations() {
		// Add Pokémon Center
		this.addSpecialBuilding(20, "center");

		// Add Pokémon Gym
		this.addSpecialBuilding(21, "gym");

		// Add Pokémart
		this.addSpecialBuilding(22, "mart");

		// Add other landmarks
		this.addSpecialBuilding(23, "landmark");
	}

	addSpecialBuilding(tileIndex, type) {
		// Number of buildings to add
		let numBuildings;

		switch (type) {
			case "center":
				numBuildings = Math.floor(this.worldSize.width / 800);
				break;
			case "gym":
				numBuildings = Math.floor(this.worldSize.width / 1200);
				break;
			case "mart":
				numBuildings = Math.floor(this.worldSize.width / 1000);
				break;
			case "landmark":
				numBuildings = Math.floor(this.worldSize.width / 600);
				break;
			default:
				numBuildings = 1;
		}

		// Add the buildings
		for (let i = 0; i < numBuildings; i++) {
			// Try to find a good location
			let foundLocation = false;
			let attempts = 0;
			let x, y;

			while (!foundLocation && attempts < 50) {
				x = Phaser.Math.Between(5, this.map.width - 5);
				y = Phaser.Math.Between(5, this.map.height - 5);

				// Check if location is suitable (on grass and near path)
				const currentTile = this.groundLayer.getTileAt(x, y);

				let nearPath = false;
				// Check surrounding tiles for path
				for (let dx = -2; dx <= 2; dx++) {
					for (let dy = -2; dy <= 2; dy++) {
						const checkX = x + dx;
						const checkY = y + dy;

						if (
							checkX >= 0 &&
							checkX < this.map.width &&
							checkY >= 0 &&
							checkY < this.map.height
						) {
							const checkTile = this.groundLayer.getTileAt(checkX, checkY);
							if (checkTile && checkTile.index === 2) {
								nearPath = true;
								break;
							}
						}
					}
					if (nearPath) break;
				}

				if (currentTile && currentTile.index === 1 && nearPath) {
					foundLocation = true;

					// Create building and surrounding area
					this.groundLayer.putTileAt(tileIndex, x, y);

					// Add some decoration around the building
					for (let dx = -1; dx <= 1; dx++) {
						for (let dy = -1; dy <= 1; dy++) {
							if (dx === 0 && dy === 0) continue; // Skip the building itself

							const decorX = x + dx;
							const decorY = y + dy;

							if (
								decorX >= 0 &&
								decorX < this.map.width &&
								decorY >= 0 &&
								decorY < this.map.height
							) {
								// Small chance to add decorative tile
								if (Phaser.Math.FloatBetween(0, 1) < 0.3) {
									const decorTile = Phaser.Math.Between(9, 15);
									this.groundLayer.putTileAt(decorTile, decorX, decorY);
								}
							}
						}
					}
				}

				attempts++;
			}
		}
	}

	addCollision() {
		// Add collision for mountains, water, and buildings
		this.groundLayer.setCollision([3, 4, 7, 20, 21, 22, 23]);

		// Trees have partial collision (depends on implementation)
		this.groundLayer.setCollision([5, 6], true);
	}

	// Public methods
	getGroundLayer() {
		return this.groundLayer;
	}

	getTileAt(x, y) {
		return this.groundLayer.getTileAt(x, y);
	}

	isTileWalkable(x, y) {
		const tile = this.groundLayer.getTileAt(
			Math.floor(x / this.gridSize),
			Math.floor(y / this.gridSize)
		);

		return tile ? !tile.collides : true;
	}
}
