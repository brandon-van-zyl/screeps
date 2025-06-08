import { find } from "lodash";

export class DebugVisuals {
	public static DrawDebugText() {
		//Draw text top level of the room
		Object.entries(Game.rooms).forEach(([roomName, room]) => {
			// get total creeps per role
			var roleCounts = _.countBy(room.find(FIND_MY_CREEPS), creep => creep.memory.role);
			var totalCreeps = room.find(FIND_MY_CREEPS).length;

			// get total energy in the room
			var totalEnergy = room.energyAvailable;
			// get total energy capacity in the room
			var totalEnergyCapacity = room.energyCapacityAvailable;
			// get total construction sites in the room

            Game.map.visual.text(
                "Energy: " + totalEnergy + "/" + totalEnergyCapacity,
                new RoomPosition(3, 1, roomName),
                { color: "#ffffff", fontSize: 10 }
            );
            Game.map.visual.text("Total creeps: " + totalCreeps, new RoomPosition(3, 2, roomName), {
				color: "#ffffff",
				fontSize: 10
			});
            Object.entries(roleCounts).forEach(([role, count]) => {
				Game.map.visual.text(
					`${role}: ${count}`,
					new RoomPosition(3, 3 + Object.keys(roleCounts).indexOf(role), roomName),
					{ color: "#ffffff", fontSize: 10 }
				);
			});

		});
	}
}
