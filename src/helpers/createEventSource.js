import { getDomain } from "./getDomain";

export const createEventSource = (relativeURL) => {
    const eventURL = new URL(relativeURL, getDomain());
    const eventSource = new EventSource(eventURL);

    eventSource.onopen = (event) => {
        console.log("Connection established");
    };

    eventSource.onerror = (event) => {
        console.log("OnError fired: ", event.target.readyState);
        eventSource.close();
    };

    return eventSource;
};