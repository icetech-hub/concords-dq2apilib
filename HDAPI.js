// Messages
class Tbl {
  constructor(
    symbol,
    datetime,
    lastprice,
    volume,
    totalvolume,
    bidprice1,
    askprice1,
    oi
  ) {
    this.symbol = symbol;
    this.datetime = datetime;
    this.lastprice = lastprice;
    this.volume = volume;
    this.totalvolume = totalvolume;
    this.bidprice1 = bidprice1;
    this.askprice1 = askprice1;
    this.oi = oi;
  }
}

class Omk {
  constructor(
    symbol,
    datetime,
    openprice,
    highestprice,
    lowestprice,
    closeprice,
    volume,
    amount,
    oi,
    json_b,
    totalvolume,
    totalamount,
    half
  ) {
    this.symbol = symbol;
    this.datetime = datetime;
    this.openprice = openprice;
    this.highestprice = highestprice;
    this.lowestprice = lowestprice;
    this.closeprice = closeprice;
    this.volume = volume;
    this.amount = amount;
    this.oi = oi;
    this.json_b = json_b;
    this.totalvolume = totalvolume;
    this.totalamount = totalamount;
    this.half = half;
  }
}

class HDData {
  constructor(code, msg, type, recognize, omks = [], tbls = []) {
    this.code = code;
    this.msg = msg;
    this.type = type;
    this.recognize = recognize;
    this.omks = omks;
    this.tbls = tbls;
  }
}

module.exports = {
  Tbl,
  Omk,
  HDData,
};
