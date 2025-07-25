import { create } from 'zustand';

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

 const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () =>
    set((state) => ({
      count: state.count + 1, // `state` is typed automatically
    })),
  decrement: () =>
    set((state) => ({
      count: state.count - 1,
    })),
}));

 export default useCounterStore;
