import CommandChain, { ChainCommand } from "./CommandChain";
import EventBus, { DomainEvent } from "./EventBus";

class AddItem implements ChainCommand {
    constructor(public id: string, public name: string) { }
}

class ItemAdded implements DomainEvent {
    constructor(public id: string, public name: string) { }
}

const eventBus = new EventBus();

const commandChain = new CommandChain()
    .registerProcessor<AddItem>(AddItem.name, async (message) => {
        console.log("[ItemAdd] - processing...")
        eventBus.emit(new ItemAdded("1", "First Item"))
    })


eventBus.on<ItemAdded>("ItemAdded", async (event) => {
    console.log(`[ItemAdded] - Id: ${event.id}, Name: ${event.name}`)
})


commandChain.process(new AddItem("1", "First Item"))



