import React from "react";
import IframeComm from "../IframeComm";
import { storiesOf, action, linkTo } from "@kadira/storybook";
import { WithNotes } from "@kadira/storybook-addon-notes";
import {
    withKnobs,
    text,
    boolean,
    number,
    object
} from "@kadira/storybook-addon-knobs";

const stories = storiesOf("Iframe Communication", module);
stories.addDecorator(withKnobs);

stories.add("simple example", () => {
    const attributes = {
        // src: "https://pbojinov.github.io/iframe-communication/iframe.html",
        // src: "http://127.0.0.1:8080/public/iframe.html",
        src: "http://127.0.0.1:8080/index.html?full_name=Petar%20Bojinov", // first add card
        // src: "http://127.0.0.1:8080/index.html?token=2hOVl5EDLi2O03Jb20sAUUGAk8m&last_four_digits=4242", // recache
        width: "100%",
        height: 500
    };
    // the postMessage data you want to send to your iframe
    // it will be send after the iframe has loaded
    let postMessageData = {
        message: "helloworld",
        data: {}
    };

    // parent received a message from iframe
    const onReceiveMessage = event => {
        console.info("handleReceiveMessage", event);

        let { origin, data: eventData } = event;
        try {
            eventData = JSON.parse(eventData);
        } catch (ex) {
            console.error(ex);
            eventData = {};
        }

        const { message, data } = eventData;
        // console.log(`${message}: ${JSON.stringify(data)}`);
        switch (message) {
            case "handleCVVUpdated":
                // do someething
                const { token: cvv_token, updatedAt } = data;
                break;
            case "handleCardReady":
                // do someething
                break;
            case "handleCardAdded":
                const {
                    token: cc_token,
                    last_four_digits,
                    card_type,
                    full_name
                } = data;
                console.warn(`We got the token in the parent! ${cc_token}`);
                break;
            case "handleSubmitPressed":
                // do someething
                postMessageData = {
                    message: "doTokenization",
                    data: {}
                };
                break;

            case "handleError":
                const { error } = data;
                /*
                    Example error when recache fails with un-retained method:
                    -------------------------
                    error === [{
                        key: "messages.unable_to_recache_since_storage_state_is_not_retained"
                        message: "Recaching the sensitive information failed because the payment method is not retained."
                        status: 422
                    }]
                 */
                break;
            // ------------------------------------------
            // NOT IN USE
            // ------------------------------------------
            // case "handleInputFocus":
            //     const { inputName } = data;
            //     break;
            default:
                break;
        }
    };

    // iframe has loaded
    const onReady = () => {
        console.info("onReady");
    };

    return (
        <span>
            <IframeComm
                attributes={attributes}
                postMessageData={object("Post Message Data", postMessageData)}
                handleReady={onReady}
                handleReceiveMessage={onReceiveMessage}
            />
        </span>
    );
});
