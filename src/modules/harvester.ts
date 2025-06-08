import { roles } from "roles";
import { Builder } from "./builder";
import { Upgrader } from "./upgrader";

export class Harvester {
    public static Run(creep : Creep) {
        //Harvest Only
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            //Deposit Energy
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
             }
            else if(constructionSites.length > 0) {
                Builder.Run(creep);
            }else{
                Upgrader.Run(creep);
            }
        }
	}
}
