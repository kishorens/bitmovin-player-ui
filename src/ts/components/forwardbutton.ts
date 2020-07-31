import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';


/**
 * Configuration interface for the {@link ForwardButton}.
 */
export interface ForwardButtonConfig extends ButtonConfig {
  /**
   * The interval in seconds.
   * Default: 15 seconds
   */
  interval?: number;
}

/**
 * A button that forwards playback.
 */
export class ForwardButton extends Button<ForwardButtonConfig> {

  constructor(config: ForwardButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, <ForwardButtonConfig>{
      cssClass: 'ui-forwardbutton',
      interval:15,
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      player.seek(Math.min(player.getDuration(), player.getCurrentTime() + this.config.interval));
    });
  }
}
