export interface ChainCommand { }

interface Processor<T extends ChainCommand> {
    (message: T): Promise<void>
}

export default class CommandChain {
    private readonly _processors = new Map<string, Processor<any>>();

    registerProcessor<T extends ChainCommand>(commandName: string, processor: Processor<T>): this {
        if (this._processors.has(commandName)) throw new Error(`Processor for "${commandName}" command is already registered`)
        this._processors.set(commandName, processor);
        return this
    }
    async process(command: ChainCommand): Promise<void> {
        const handler = this._processors.get(command.constructor.name);
        if (handler === undefined)
            throw new Error(`No register processor for "${command.constructor.name}" command`)
        await handler(command)
    }
}

