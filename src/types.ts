/**
 * An array of available tiktoken models.
 * @type {string[]}
 */
export const tiktokenModels : string[] = [ "gpt2",
"gpt-3.5-turbo",
"gpt-35-turbo",
"gpt-3.5-turbo-0301",
"gpt-3.5-turbo-0613",
"gpt-3.5-turbo-1106",
"gpt-3.5-turbo-0125",
"gpt-3.5-turbo-16k",
"gpt-3.5-turbo-16k-0613",
"gpt-3.5-turbo-instruct",
"gpt-3.5-turbo-instruct-0914",
"gpt-4",
"gpt-4-0314",
"gpt-4-0613",
"gpt-4-32k",
"gpt-4-32k-0314",
"gpt-4-32k-0613",
"gpt-4-turbo",
"gpt-4-turbo-2024-04-09",
"gpt-4-turbo-preview",
"gpt-4-1106-preview",
"gpt-4-0125-preview",
"gpt-4-vision-preview",
"gpt-4o",
"gpt-4o-2024-05-13"];

/**
 * The type of a setting.
 * @type {('toggle' | 'dropdown' | 'group')}
 * @description A string literal type representing the different kinds of settings available.
 */
export type SettingType = 'toggle' | 'dropdown' | 'group';

/**
 * @interface BaseSetting
 * @property {SettingType} type - The type of the setting.
 * @property {string} description - The description of the setting.
 * @description A base interface for all settings.
 */
export interface BaseSetting {
  type: SettingType;
  description: string;
}

/**
 * @interface ToggleSetting
 * @extends {BaseSetting}
 * @property {'toggle'} type - The type of the setting.
 * @property {boolean} value - The value of the toggle setting.
 * @description An interface for a toggle setting.
 */
export interface ToggleSetting extends BaseSetting {
  type: 'toggle';
  value: boolean;
}

/**
 * @interface DropdownSetting
 * @extends {BaseSetting}
 * @property {'dropdown'} type - The type of the setting.
 * @property {string} value - The selected value of the dropdown setting.
 * @property {string[]} options - The available options for the dropdown setting.
 * @description An interface for a dropdown setting.
 */
export interface DropdownSetting extends BaseSetting {
  type: 'dropdown';
  value: string;
  options: string[];
}

/**
 * @interface GroupSetting
 * @extends {BaseSetting}
 * @property {'group'} type - The type of the setting.
 * @property {{ [key: string]: Setting }} children - The nested settings within the group.
 * @description An interface for a group of settings.
 */
export interface GroupSetting extends BaseSetting {
  type: 'group';
  children: {
    [key: string]: Setting;
  };
}

/**
 * A union type representing any possible setting.
 * @type {(ToggleSetting | DropdownSetting | GroupSetting)}
 * @description A union type that can represent any of the available setting types.
 */
export type Setting = ToggleSetting | DropdownSetting | GroupSetting;

/**
 * @interface AppState
 * @property {boolean} isActive - Whether the extension is active.
 * @property {{ [key: string]: Setting }} settings - The settings for the application.
 * @description The overall state of the application.
 */
export interface AppState {
  isActive: boolean;
  settings: {
    [key: string]: Setting;
  };
}

/**
 * The initial state of the application.
 * @type {AppState}
 */
export const initialState: AppState = {
  isActive: false,
  settings: {
    tokens: {
      type: 'group',
      description: "Token Settings (beta)",
      children: {
        show_tokens: {
          type: 'toggle',
          value: false,
          description: "Highlight the model tokens"
        },
        tokenizer: {
          type: 'dropdown',
          value: 'gpt-4o',
          description: "Select tokenizer",
          options: tiktokenModels
        }
      }
    },
    leetspeak: {
      type: 'toggle',
      value: true,
      description: "Convert words into 1337."
    },
    base64: {
      type: 'toggle',
      value: true,
      description: "Convert words into base64."
    },
    pigLatin: {
      type: 'toggle',
      value: true,
      description: "Convert words into pig latin."
    },
    scramble: {
      type: 'toggle',
      value: true,
      description: "Convert words into scramble organization."
    },
    binary: {
      type: 'toggle',
      value: true,
      description: "Convert words into binary."
    },
    emoji: {
      type: 'toggle',
      value: true,
      description: "Convert words into emojis."
    },
    // theme: {
    //   type : 'dropdown',
    //   value: 'dark',
    //   options: ['dark', 'light'],
    //   description: "Theme Settings"
    // }
  }
};