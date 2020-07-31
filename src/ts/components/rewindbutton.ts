import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';

/**
 * Configuration interface for the {@link RewindButton}.
 */
export interface RewindButtonConfig extends ButtonConfig {
  /**
   * The interval in seconds.
   * Default: 15 seconds
   */
  interval?: number;
}

/**
 * A button that rewinds playback.
 */
export class RewindButton extends Button<RewindButtonConfig> {

  constructor(config: RewindButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, <RewindButtonConfig>{
      cssClass: 'ui-rewindbutton',
      interval:15,
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);
    this.onClick.subscribe(() => {
      player.seek(Math.max(0, player.getCurrentTime() - this.config.interval));
    });
  }
}