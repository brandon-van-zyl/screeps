import { ErrorMapper } from "utils/ErrorMapper";
import { Spawner } from "./modules/spawner"
import { Harvester } from "modules/harvester";
import { Upgrader } from "modules/upgrader";
import { Builder } from "modules/builder";
import { ConstructionSpawner } from "modules/construction-spawner";
import { DebugVisuals } from "utils/debugging-visuals";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }
  interface RoomMemory {
    roadsToSources?: boolean

  }

  interface CreepMemory {
    role: string;
    room?: string;
    working?: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  DebugVisuals.DrawDebugText();
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  Spawner.Spawn()
  ConstructionSpawner.CreateExtensionSites();
  ConstructionSpawner.CreateRoadsToSources()

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      Harvester.Run(creep);
    }
    if (creep.memory.role === "upgrader") {
      Upgrader.Run(creep);
    }
    if (creep.memory.role === "builder") {
      Builder.Run(creep);
    }
  }
});
