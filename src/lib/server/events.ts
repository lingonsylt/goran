import { EventEmitter, on } from "events"

export const emitter = new EventEmitter()
emitter.setMaxListeners(0)

type EventType = 'newVote'
const eventString = (type: EventType, id: string) => `${type}:${id}`
export const event = (type: EventType, id: string) => on(emitter, eventString(type, id))
export const emit = <T>(type: EventType, id: string, value: T) => emitter.emit(eventString(type, id), value)

export const liveQuery = <T>(eventType: EventType, id: string, fn: () => T) => async function* () {
	yield await fn()
	for await (const _ of event(eventType, id)) {
		yield await fn()
	}
}
