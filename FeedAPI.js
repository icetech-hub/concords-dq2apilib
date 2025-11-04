// Enums
const Version = {
  VERSION_VALUE: 1000010,
};

const MktCate = {
  MC_TWS_TSE: 1,
  MC_TWS_OTC: 2,
};

const SymbCate = {
  SC_TWS_INDEX: 0,
  SC_TWS_STOCK: 1,
  SC_TWS_WARRRANT: 2,
  SC_TWS_ETF: 3,
  SC_TWS_BOND_COMP: 4,
  SC_TWS_BOND_DEPO: 5,
  SC_TWS_BOND_CENT: 6,
  SC_TWS_BOND_FOREIGN: 7,
};

const WarrStat = {
  WS_TWS_00: 0,
  WS_TWS_01: 1,
  WS_TWS_02: 2,
  WS_TWS_03: 3,
  WS_TWS_04: 4,
  WS_TWS_05: 5,
  WS_TWS_06: 6,
  WS_TWS_07: 7,
};

const TsState = {
  TSSTATE_CLEAR: 2,
  TSSTATE_OPEN: 3,
  TSSTATE_CLOSE: 4,
  TSSTATE_PREOPEN: 5,
  TSSTATE_SUSPEND: 6,
  TSSTATE_REMOVE: 7,
};

const TrgCate = {
  TC_INDEX: 1,
  TC_STOCK: 2,
  TC_COMMODITY: 3,
  TC_BOND: 4,
  TC_CURRENCY: 5,
  TC_INTEREST_RATE: 6,
};

// Messages
class MainMsg {
  constructor() {
    this.Logon = null;
    this.LogonReply = null;
    this.AdapterStatus = null;
    this.Command = null;
    this.CommandReply = null;
    this.SymbolMaps = [];
    this.ContractLists = [];
    this.Realtimes = [];
    this.Heartbeat = null;
    this.SymbolLists = [];
    this.Continued = null;
  }
}

class Logon {
  constructor(System, Password, Source, ProtocolVersion) {
    this.System = System;
    this.Password = Password;
    this.Source = Source;
    this.ProtocolVersion = ProtocolVersion;
  }
}

class LogonReply {
  constructor(Result, Description = null) {
    this.Result = Result;
    this.Description = Description;
  }
}

class AdapterStatus {
  constructor(Status, Description = null) {
    this.Status = Status;
    this.Description = Description;
  }
}

class Command {
  constructor(Cmd, Parameters = []) {
    this.Cmd = Cmd;
    this.Parameters = Parameters;
  }
}

class CommandReply {
  constructor(Cmd, Parameters = [], Result, Description = null) {
    this.Cmd = Cmd;
    this.Parameters = Parameters;
    this.Result = Result;
    this.Description = Description;
  }
}

class SymbolMap {
  constructor(DQ2Code, Exchange, Symbol, Multiplier = 1, DQ2Extra = null) {
    this.DQ2Code = DQ2Code;
    this.Exchange = Exchange;
    this.Symbol = Symbol;
    this.Multiplier = Multiplier;
    this.DQ2Extra = DQ2Extra;
  }
}

class ContractList {
  constructor(
    SymbCode,
    Name,
    CreateDate = null,
    SettlementDate = null,
    ExpireDate = null,
    LastTradingday = null,
    ExchOrderSymbol = null,
    BoardLot = null,
    MarketCategory = null,
    SymbolCategory = null,
    WarrningState = null
  ) {
    this.SymbCode = SymbCode;
    this.Name = Name;
    this.CreateDate = CreateDate;
    this.SettlementDate = SettlementDate;
    this.ExpireDate = ExpireDate;
    this.LastTradingday = LastTradingday;
    this.ExchOrderSymbol = ExchOrderSymbol;
    this.BoardLot = BoardLot;
    this.MarketCategory = MarketCategory;
    this.SymbolCategory = SymbolCategory;
    this.WarrningState = WarrningState;
  }
}

class Realtime {
  constructor(
    Snapshot = false,
    SymbCode = null,
    SendCode = null,
    Date = null,
    Time = null,
    Market = null,
    Deal = null,
    DOM = null
  ) {
    this.Snapshot = Snapshot;
    this.SymbCode = SymbCode;
    this.SendCode = SendCode;
    this.Date = Date;
    this.Time = Time;
    this.Market = Market;
    this.Deal = Deal;
    this.DOM = DOM;
  }
}

class Market {
  constructor(
    TradeSession = null,
    UpperLimitPrice = null,
    LowerLimitPrice = null,
    ReferencePrice = null,
    SettlementPrice = null,
    ClosePrice = null,
    PreClosePrice = null,
    PreTotalVolume = null
  ) {
    this.TradeSession = TradeSession;
    this.UpperLimitPrice = UpperLimitPrice;
    this.LowerLimitPrice = LowerLimitPrice;
    this.ReferencePrice = ReferencePrice;
    this.SettlementPrice = SettlementPrice;
    this.ClosePrice = ClosePrice;
    this.PreClosePrice = PreClosePrice;
    this.PreTotalVolume = PreTotalVolume;
  }
}

class Deal {
  constructor(
    IsClear = false,
    LastPrice = null,
    Volume = null,
    TotalVolume = null,
    Amount = null,
    TotalAmount = null,
    OpenPrice = null,
    HighestPrice = null,
    LowestPrice = null,
    BidPrice = null,
    BidVolume = null,
    AskPrice = null,
    AskVolume = null,
    OpenInterest = null
  ) {
    this.IsClear = IsClear;
    this.LastPrice = LastPrice;
    this.Volume = Volume;
    this.TotalVolume = TotalVolume;
    this.Amount = Amount;
    this.TotalAmount = TotalAmount;
    this.OpenPrice = OpenPrice;
    this.HighestPrice = HighestPrice;
    this.LowestPrice = LowestPrice;
    this.BidPrice = BidPrice;
    this.BidVolume = BidVolume;
    this.AskPrice = AskPrice;
    this.AskVolume = AskVolume;
    this.OpenInterest = OpenInterest;
  }
}

class DOM {
  constructor(BidPrices = [], BidVolumes = [], AskPrices = [], AskVolumes = []) {
    this.BidPrices = BidPrices;
    this.BidVolumes = BidVolumes;
    this.AskPrices = AskPrices;
    this.AskVolumes = AskVolumes;
  }
}

class Heartbeat {
  constructor(Date, Time) {
    this.Date = Date;
    this.Time = Time;
  }
}

class SymbolList {
  constructor(
    Exchange,
    Symbol,
    Name,
    Category,
    ContractSize,
    Currency,
    Target,
    TargetCategory = null
  ) {
    this.Exchange = Exchange;
    this.Symbol = Symbol;
    this.Name = Name;
    this.Category = Category;
    this.ContractSize = ContractSize;
    this.Currency = Currency;
    this.Target = Target;
    this.TargetCategory = TargetCategory;
  }
}

module.exports = {
  Version,
  MktCate,
  SymbCate,
  WarrStat,
  TsState,
  TrgCate,
  MainMsg,
  Logon,
  LogonReply,
  AdapterStatus,
  Command,
  CommandReply,
  SymbolMap,
  ContractList,
  Realtime,
  Market,
  Deal,
  DOM,
  Heartbeat,
  SymbolList,
};
