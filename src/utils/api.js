import Axios from "axios";

export default class Api {
  backendURL = "http://54.86.64.170:8080/v1";
  async fetchCategories() {
    try {
      const resp = await Axios({
        method: "get",
        url: this.backendURL + `/category/fetch/all`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async fetchActiveMarkets() {
    try {
      const resp = await Axios({
        method: "get",
        url: this.backendURL + `/marketDetails/fetch/active`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }

  async createMarket(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/marketDetails/add`,
        data: data,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async addLiquidity(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/liquidity/add`,
        data: data,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async addOutcomes(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/outcomes/add`,
        data,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async addHolding(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/holding/add`,
        data,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async activateMarket(id) {
    try {
      const resp = await Axios({
        method: "put",
        url: this.backendURL + `/marketDetails/activate?id=${id}`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }

  async activateLiquidity(id) {
    try {
      const resp = await Axios({
        method: "put",
        url: this.backendURL + `/liquidity/activate?id=${id}`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async activateHolding(id) {
    try {
      const resp = await Axios({
        method: "put",
        url: this.backendURL + `/holding/activate?id=${id}`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async fetchParticularMarket(id) {
    try {
      const resp = await Axios({
        method: "get",
        url: this.backendURL + `/marketDetails/fetch?id=${id}`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async fetchParticularMarketLiquidity(id) {
    try {
      const resp = await Axios({
        method: "get",
        url: this.backendURL + `/liquidity/fetch/market?marketId=${id}`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async fetchParticularMarketHolding(id) {
    try {
      const resp = await Axios({
        method: "get",
        url: this.backendURL + `/holding/fetch/market?marketId=${id}`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
  async fetchParticularMarketOutcome(id) {
    try {
      const resp = await Axios({
        method: "get",
        url: this.backendURL + `/outcomes/fetch/market?marketId=${id}`,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      return err.response.data;
    }
  }
}

