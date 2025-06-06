export class Builder {
	public static Run(creep: Creep) {
		creep.say(creep.name);
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
			creep.say("🔄 harvest");
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
			creep.say("🚧 build");
		}

		if (creep.memory.building) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
				}
			}
		} else {
			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
			}
		}
	}
	public static CreateContructionSites() {
		if (Game.spawns["Spawn1"].spawning) {
			return;
		}
		const extensionPerLevel: Record<number, number> = {
			1: 0,
			2: 5,
			3: 10,
			4: 20,
			5: 30,
			6: 40,
			7: 50,
			8: 60
		};

		var room = Game.spawns["Spawn1"].room;

		const extensionStructures = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_EXTENSION;
			}
		});
        const extensionContructionSites = Game.spawns["Spawn1"].room.find(FIND_CONSTRUCTION_SITES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_EXTENSION;
			}
		});

		if (room.controller && (extensionStructures.length + extensionContructionSites.length) < extensionPerLevel[room.controller?.level]) {
			var spawner = Game.spawns["Spawn1"];
			var lastConstructionSite = extensionStructures[extensionStructures.length - 1];
			var lastPos = lastConstructionSite ? lastConstructionSite.pos : spawner.pos;
			console.log("Creating construction site for extension at: " + (lastPos.x - 1) + ", " + lastPos.y);
			room.createConstructionSite(lastPos.x - 1, lastPos.y, STRUCTURE_EXTENSION);
		}
	}
}
