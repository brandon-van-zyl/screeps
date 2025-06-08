import { roles } from "roles";

export class Spawner {
    public static Spawn() {
        const spawn = Game.spawns["Spawn1"];
        const room = spawn.room;

        // Define desired creep counts based on room conditions
        const desiredCreepCounts = {
            [roles.harvester]: room.energyAvailable < room.energyCapacityAvailable ? 6 : 3,
            [roles.upgrader]: 2,
            [roles.builder]: room.find(FIND_CONSTRUCTION_SITES).length > 0 ? 2 : 1,
        };

        // Count existing creeps by role
        const creepCounts = _.countBy(Game.creeps, creep => creep.memory.role);

        // Spawn creeps based on priority
        for (const role in desiredCreepCounts) {
            if ((creepCounts[role] || 0) < desiredCreepCounts[role]) {
                const newName = `${role.charAt(0).toUpperCase() + role.slice(1)}${Game.time}`;

                const body = this.getBodyForRole(role, room.energyAvailable);
                if(this.canSpawnCreep(body, room.energyAvailable)) {
                    console.log(`Spawning new ${role}: ${newName}`);
                    spawn.spawnCreep(body, newName, { memory: { role } });
                    break; // Spawn one creep at a time
                }
            }
        }
    }

    private static getBodyForRole(role: string, energyAvailable: number): BodyPartConstant[] {
        // Define body configurations for each role
        const bodyConfigs: { [role: string]: BodyPartConstant[][] } = {
            [roles.harvester]: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, MOVE, MOVE, MOVE]],
            [roles.upgrader]: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, MOVE, MOVE, MOVE]],
            [roles.builder]: [[WORK, CARRY, MOVE], [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]],
        };

        // Select the best body configuration based on available energy
        const configs = bodyConfigs[role] || [[WORK, CARRY, MOVE]];
        return configs.reverse().find(config => this.calculateBodyCost(config) <= energyAvailable) || configs[0];
    }

    private static calculateBodyCost(body: BodyPartConstant[]): number {
        const bodyPartCosts: { [part: string]: number } = {
            [WORK]: 100,
            [CARRY]: 50,
            [MOVE]: 50,
        };
        return body.reduce((cost, part) => cost + bodyPartCosts[part], 0);
    }

    private static canSpawnCreep(body: BodyPartConstant[], energyAvailable: number): boolean {
        return this.calculateBodyCost(body) <= energyAvailable;
    }
}
