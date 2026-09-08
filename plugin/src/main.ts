import { Notice, Plugin } from "obsidian";

interface PluginSettings {
  serviceUrl: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
  serviceUrl: ""
};

export default class CloudSyncPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData() as Partial<PluginSettings> | null) };

    this.addCommand({
      id: "show-baseline-status",
      name: "Show baseline status",
      callback: () => {
        new Notice(
          this.settings.serviceUrl
            ? `Cloud Sync baseline configured for ${this.settings.serviceUrl}`
            : "Cloud Sync baseline loaded; no sync service is configured yet."
        );
      }
    });

    this.addStatusBarItem().setText("Cloud Sync: not configured");
  }

  async onunload(): Promise<void> {
    await this.saveData(this.settings);
  }
}
