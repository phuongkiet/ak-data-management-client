export default class BaseStore {
  protected changeListeners: (() => void)[] = [];

  addChangeListener = (listener: () => void) => {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== listener);
    };
  };

  protected notifyChange = () => {
    this.changeListeners.forEach(listener => listener());
  };
} 