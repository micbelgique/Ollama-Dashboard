// Créez ce nouveau fichier pour gérer les événements
type EventCallback = () => void;

class EventBus {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Renvoie une fonction pour se désabonner
    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  }

  emit(event: string) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback());
    }
  }
}

export const eventBus = new EventBus();
