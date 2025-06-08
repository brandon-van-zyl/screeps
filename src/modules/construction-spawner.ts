export class ConstructionSpawner {
	public static CreateExtensionSites() {
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

		const extensionStructures = room.find(FIND_STRUCTURES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_EXTENSION;
			}
		});
		const extensionContructionSites = room.find(FIND_CONSTRUCTION_SITES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_EXTENSION;
			}
		});

		if (
			room.controller &&
			extensionStructures.length + extensionContructionSites.length < extensionPerLevel[room.controller?.level]
		) {
			var spawner = Game.spawns["Spawn1"];
			var lastConstructionSite = extensionContructionSites[extensionContructionSites.length - 1];
			var lastPos = lastConstructionSite?.pos ?? spawner.pos;
			console.log("Creating construction site for extension at: " + (lastPos.x - 1) + ", " + lastPos.y);
			room.createConstructionSite(lastPos.x - 1, lastPos.y, STRUCTURE_EXTENSION);
		}
	}

	public static CreateContainerSites() {
        console.log('Creating container sites');
		var spawn = Game.spawns["Spawn1"];
		var room = spawn.room;
		if (spawn.spawning) {
			return;
		}

		var targets = room.find(FIND_STRUCTURES, {
			filter: structure => {
				return (
					(structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_TOWER) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
				);
			}
		});

		const containerStructures = room.find(FIND_STRUCTURES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_CONTAINER;
			}
		});
		const containerContructionSites = room.find(FIND_CONSTRUCTION_SITES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_CONTAINER;
			}
		});

        console.log(`Container structures: ${containerStructures.length}, Construction sites: ${containerContructionSites.length}, Targets: ${targets.length}`);

		if (targets.length <= 0 && containerStructures.length < 5) {
            var lastConstructionSite = containerContructionSites[containerContructionSites.length - 1];
			var lastPos = lastConstructionSite?.pos ?? spawn.pos;
			room.createConstructionSite(lastPos.x, lastPos.y - 1, STRUCTURE_CONTAINER);
		}
	}


    public static CreateRoadsToSources() {
        var spawn = Game.spawns["Spawn1"];
        var room = spawn.room;
        if (spawn.spawning || room.memory.roadsToSources) {
            return;
        }
        var sources = room.find(FIND_SOURCES);
        console.log('Creating roads');
        for (var j = 0; j < sources.length; j++)
        {
            var chemin = spawn.pos.findPathTo(sources[j].pos);
            for (var i = 0; i < chemin.length; i++)
            {
                room.createConstructionSite(chemin[i].x,chemin[i].y, STRUCTURE_ROAD);
            }
        }
        room.memory.roadsToSources = true;
    }
}
