/*
 * Copyright (C) 2016, bitmovin GmbH, All Rights Reserved
 *
 * Authors: Mario Guggenberger <mario.guggenberger@bitmovin.com>
 *
 * This source code and its use and distribution, is subject to the terms
 * and conditions of the applicable license agreement.
 */

import {ClickOverlay} from "./clickoverlay";
import {UIManager} from "../uimanager";

/**
 * A simple click capture overlay for clickThroughUrls of ads.
 */
export class AdClickOverlay extends ClickOverlay {

    configure(player: bitmovin.player.Player, uimanager: UIManager): void {
        super.configure(player, uimanager);

        let self = this;
        let clickThroughUrl = <string>null;
        let clickThroughEnabled = !player.getConfig().advertising
            || !player.getConfig().advertising.hasOwnProperty("clickThroughEnabled")
            || player.getConfig().advertising.clickThroughEnabled;

        player.addEventHandler(bitmovin.player.EVENT.ON_AD_STARTED, function (event: bitmovin.player.AdStartedEvent) {
            clickThroughUrl = event.clickThroughUrl;

            if (clickThroughEnabled) {
                self.setUrl(clickThroughUrl);
            } else {
                // If click-through is disabled, we set the url to null to avoid it open
                self.setUrl(null);
            }
        });

        // Clear click-through URL when ad has finished
        let adFinishedHandler = function () {
            self.setUrl(null);
        };
        player.addEventHandler(bitmovin.player.EVENT.ON_AD_FINISHED, adFinishedHandler);
        player.addEventHandler(bitmovin.player.EVENT.ON_AD_SKIPPED, adFinishedHandler);

        self.onClick.subscribe(function () {
            // Pause the ad when click-through URL opens
            if (clickThroughEnabled) {
                player.pause();
            }

            // Notify the player of the clicked ad
            player.fireEvent(bitmovin.player.EVENT.ON_AD_CLICKED, {
                clickThroughUrl: clickThroughUrl
            });
        });
    }
}