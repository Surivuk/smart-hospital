import HealthData from "@healthCenter/healthData/HealthData";
import HealthDataRepository from "@healthCenter/HealthDataRepository";
import HealthStorage, { ReceivedHealthData } from "@healthCenter/HealthStorage";

const seconds = (amount: number) => 1000 * amount;
const minutes = (amount: number) => seconds(60) * amount;

class MockHealthDataRepository implements HealthDataRepository {
    public data: HealthData[] = []
    async save(healthData: HealthData[]): Promise<void> {
        this.data = this.data.concat(healthData);
    }
}
class DataA extends HealthData {
    private readonly _value: number
    constructor(private _timestamp: number, value: string) {
        super()
        this._value = parseInt(value)
    }
    type(): string { return "data_a" }
    value(): string { return `${this._value}` }
    timestamp(): number { return this._timestamp }

    isNormal(): boolean { return this._value <= 10 }
    isWarning(): boolean { return this._value > 10 && this._value <= 20 }
    isCritical(): boolean { return this._value > 20 }
}
class DataB extends HealthData {
    private readonly _value: number
    constructor(private _timestamp: number, value: string) {
        super()
        this._value = parseInt(value)
    }
    type(): string { return "data_b" }
    value(): string { return `${this._value}` }
    timestamp(): number { return this._timestamp }

    isNormal(): boolean { return this._value <= 10 }
    isWarning(): boolean { return this._value > 10 && this._value <= 20 }
    isCritical(): boolean { return this._value > 20 }
}

const createStorage = (repository: HealthDataRepository) => {
    return new HealthStorage(repository, {
        "data_a": (timestamp: number, value: string) => new DataA(timestamp, value),
        "data_b": (timestamp: number, value: string) => new DataB(timestamp, value)
    })
}
const data = (type: string, value: string, timestamp?: number): ReceivedHealthData => ({ type, value, timestamp: timestamp !== undefined ? timestamp : new Date().getTime() })

describe('When healthStorage store a data in normal range', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "5"))
    })
    test('should be only one record', () => {
        expect(repository.data.length).toBe(1)
    });
    test('should be only one record with type "data_a"', () => {
        expect(repository.data[0].type()).toBe("data_a")
    });
});
describe('When healthStorage received multiple data in normal range, in short period', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "5"))
        await storage.storeHealthData(data("data_a", "6"))
        await storage.storeHealthData(data("data_a", "7"))
    })
    test('should store only one record', () => {
        expect(repository.data.length).toBe(1)
    });
    test('should store only first record', () => {
        expect(repository.data[0].type()).toBe("data_a")
        expect(repository.data[0].value()).toBe("5")
    });
});
describe('When healthStorage received data in different ranges', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "5"))
        await storage.storeHealthData(data("data_a", "11"))
        await storage.storeHealthData(data("data_a", "21"))
        await storage.storeHealthData(data("data_a", "4"))
    })
    test('should store four records', () => {
        expect(repository.data.length).toBe(4)
    });
    test('should store all records', () => {
        expect(repository.data[0].value()).toBe("5")
        expect(repository.data[1].value()).toBe("11")
        expect(repository.data[2].value()).toBe("21")
        expect(repository.data[3].value()).toBe("4")
    });
});
describe('When healthStorage received data with different type in normal range', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "5"))
        await storage.storeHealthData(data("data_b", "6"))
        await storage.storeHealthData(data("data_a", "7"))
        await storage.storeHealthData(data("data_b", "8"))
    })
    test('should store two record', () => {
        expect(repository.data.length).toBe(2)
    });
    test('should store (data_a) first record', () => {
        expect(repository.data[0].type()).toBe("data_a")
        expect(repository.data[0].value()).toBe("5")
    });
    test('should store (data_b) first record', () => {
        expect(repository.data[1].type()).toBe("data_b")
        expect(repository.data[1].value()).toBe("6")
    });
});
describe('When healthStorage received data with same type and in normal range but different times', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "5", 0))
        await storage.storeHealthData(data("data_a", "6", seconds(60)))
        await storage.storeHealthData(data("data_a", "7", seconds(61)))
        await storage.storeHealthData(data("data_a", "8", seconds(120)))
    })
    test('should store tree records', () => {
        expect(repository.data.length).toBe(3)
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("5")
        expect(repository.data[1].value()).toBe("6")
        expect(repository.data[2].value()).toBe("8")
    });
});
describe('When healthStorage received data with same type and in warning range but different times', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "15", 0))
        await storage.storeHealthData(data("data_a", "16", seconds(30)))
        await storage.storeHealthData(data("data_a", "17", seconds(31)))
        await storage.storeHealthData(data("data_a", "18", seconds(60)))
    })
    test('should store tree records', () => {
        expect(repository.data.length).toBe(3)
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("15")
        expect(repository.data[1].value()).toBe("16")
        expect(repository.data[2].value()).toBe("18")
    });
});
describe('When healthStorage received data with same type and in critical range but different times', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "25", 0))
        await storage.storeHealthData(data("data_a", "26", seconds(10)))
        await storage.storeHealthData(data("data_a", "27", seconds(11)))
        await storage.storeHealthData(data("data_a", "28", seconds(20)))
    })
    test('should store tree records', () => {
        expect(repository.data.length).toBe(3)
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("25")
        expect(repository.data[1].value()).toBe("26")
        expect(repository.data[2].value()).toBe("28")
    });
});
describe('When healthStorage received data with same type but in different ranges and times', () => {
    let repository: MockHealthDataRepository

    beforeAll(async () => {
        repository = new MockHealthDataRepository()
        let storage = createStorage(repository)
        await storage.storeHealthData(data("data_a", "5", seconds(0)))
        await storage.storeHealthData(data("data_a", "16", seconds(1)))
        await storage.storeHealthData(data("data_a", "27", seconds(3)))
        await storage.storeHealthData(data("data_a", "8", seconds(4)))
        await storage.storeHealthData(data("data_a", "7", seconds(5)))
        await storage.storeHealthData(data("data_a", "6", seconds(64)))
    })
    test('should store five records', () => {
        expect(repository.data.length).toBe(5)
    });
    test('should store next records', () => {
        expect(repository.data[0].value()).toBe("5")
        expect(repository.data[1].value()).toBe("16")
        expect(repository.data[2].value()).toBe("27")
        expect(repository.data[3].value()).toBe("8")
        expect(repository.data[4].value()).toBe("6")
    });
});