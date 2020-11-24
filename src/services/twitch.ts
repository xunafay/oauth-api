import Axios from 'axios';

export type TwitchUser = {
  'display_name': string,
  login: string,
  email: string,
  'profile_image_url': string,
  id: number,
};

export class Twitch {
  public accessToken: string;
  public refreshToken: string;

  private constructor(refreshToken: string, accessToken: string) {
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }

  static async fromCode(code: string): Promise<Twitch> {
    const res = await Axios({
      method: 'POST',
      url: 'https://id.twitch.tv/oauth2/token',
      params: {
        'client_id': process.env['TWITCH_ID'],
        'client_secret': process.env['TWITCH_SECRET'],
        'grant_type': 'authorization_code',
        'redirect_uri': process.env['TWITCH_REDIRECT_URI'],
        code
      }
    }).catch((err) => {console.error(err); return err;});
  
    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.data);
    }
  
    return new Twitch(res.data.refresh_token, res.data.access_token);
  }
  
  static async fromRefreshToken(refreshToken: string): Promise<Twitch> {
    const res = await Axios({
      method: 'POST',
      url: 'https://id.twitch.tv/oauth2/token',
      params: {
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken,
        'client_id': process.env['TWITCH_ID'],
        'client_secret': process.env['TWITCH_SECRET']
      }
    }).catch((err) => {console.error(err); return err;});
  
    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.data);
    }
  
    return new Twitch(refreshToken, res.data.access_token);
  }
  
  async createClip(broadcasterId: string | number): Promise<string> {
    const res = await Axios({
      method: 'POST',
      url: 'https://api.twitch.tv/helix/clips',
      params: {
        'has_delay': false,
        'broadcaster_id': broadcasterId
      },
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Client-ID': process.env['TWITCH_ID']
      }
    }).catch((err) => {console.error(err); return err;});
  
    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.data);
    }
  
    return `https://clips.twitch.tv/${res.data.data[0].id}`;
  }

  async getUser(name?: string): Promise<TwitchUser> {
    let params = {};
    if (name) {
      params = {
        login: name,
      };
    }
  
    const userRes = await Axios({
      method: 'GET',
      url: 'https://api.twitch.tv/helix/users',
      params,
      headers: {
        'client-id': process.env.TWITCH_ID,
        'Authorization': `Bearer ${this.accessToken}`
      }
    }).catch((err) => {console.error(err); return err;});
  
    if (userRes.status < 200 || userRes.status >= 300) {
      console.error(userRes);
      throw new Error(userRes.data);
    }
  
    return userRes.data.data[0];
  }
}
