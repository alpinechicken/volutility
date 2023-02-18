import {  create } from "zustand"

const useStore = create((set) => ({
    people: ['John Doe', 'Jane Doe'],
    addPerson: (person: string) =>
     set((state) => ({people: [...state.people, person] })),
}))

export default useStore