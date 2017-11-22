const ViewState = {
  START: 1,
  CAPITAL_AMOUNT_QUESTION: 2,
  RISK_QUESTION: 3,
  INVESTMENT_ENTITY_TYPE_QUESTION: 4,
  REMAINING_CAPITAL_GAINS_AMOUNT_QUESTION: 5,
  SUMMARY: 6,
  END: 7,
  TEST: 8
};

const RiskProfile = {
	LOW_RISK: 1,
  HIGH_RISK: 2
}

const InvestmentEntityType = {
	PERSONAL_INVESTOR: 1,
  CORPORATE_INVESTOR: 2,
  TRUST_INVESTOR: 3,
  FOUNDATION_INVESTOR: 4
}

const InvestmentRecommendationType = {
	INVEST_ALL_IN_VCC: 1,
  INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE: 2,
  INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K: 3,
  INVEST_ALL_IN_LP: 4,
}

var Main = React.createClass({

  getInitialState() {
    return ({currentViewState : ViewState.START, questionAnswers : {}});
  },

  runTests() {
    this.setState({currentViewState: ViewState.TEST});
  },

  goToNextView() {
    var currentViewState = this.state.currentViewState;
    if(currentViewState === ViewState.END) {
      this.setState({currentViewState : ViewState.START});
      return;
    }
    this.setState({currentViewState : currentViewState + 1});
  },


  goToPreviousView() {
    var currentViewState = this.state.currentViewState;
    if(currentViewState === ViewState.START) {
      this.setState({currentViewState : ViewState.START});
      return;
    }
    this.setState({currentViewState : currentViewState - 1});
  },

  goToStartView() {
	  this.setState({currentViewState : ViewState.START});
  },

  updateQuestionAnswer(questionAnswer) {
    var newQuestionAnswers = Object.assign({}, this.state.questionAnswers, questionAnswer);
    this.setState({questionAnswers : newQuestionAnswers});
  },

  render() {
    switch(this.state.currentViewState) {
      case ViewState.START:
        return <Start goToNextView={this.goToNextView} runTests={this.runTests}/>;
      case ViewState.CAPITAL_AMOUNT_QUESTION:
        return <CapitalAmountQuestion goToNextView={this.goToNextView} updateQuestionAnswer={this.updateQuestionAnswer}/>;
       case ViewState.RISK_QUESTION:
        return <RiskProfileQuestion goToPreviousView={this.goToPreviousView} goToNextView={this.goToNextView} updateQuestionAnswer={this.updateQuestionAnswer}/>;
       case ViewState.INVESTMENT_ENTITY_TYPE_QUESTION:
        return <InvestmentEntityTypeQuestion goToPreviousView={this.goToPreviousView} goToNextView={this.goToNextView} updateQuestionAnswer={this.updateQuestionAnswer}/>;
       case ViewState.REMAINING_CAPITAL_GAINS_AMOUNT_QUESTION:
        return <RemainingCapitalGainsAmountQuestion goToPreviousView={this.goToPreviousView} goToNextView={this.goToNextView} updateQuestionAnswer={this.updateQuestionAnswer}/>;
       case ViewState.SUMMARY:
        return <Summary goToStartView={this.goToStartView} data={this.state.questionAnswers}/>;
       case ViewState.TEST:
        return <Test/>;
      default:
        return <Start goToNextView={this.goToNextView}/>;
    }
  }

});

var Summary = React.createClass({

render() {
  	var capitalAmount = this.props.data.capitalAmount;
    var riskProfile = this.props.data.riskProfile;
    var investmentEntityType = this.props.data.investmentEntityType;
    var remainingCapitalGainsAmount = this.props.data.remainingCapitalGainsAmount;

    var investorRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile,investmentEntityType,remainingCapitalGainsAmount).recommend().recommendation();

    switch(investorRecommendation) {
    	case InvestmentRecommendationType.INVEST_ALL_IN_VCC:
      	return <InvestAllInVCCView goToStartView={this.props.goToStartView}/>;
    	case InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE:
      	return <InvestSomeInVCCSomeInLPRemainingInCGEView goToStartView={this.props.goToStartView}/>;
    	case InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K:
      	return <InvestUpTo800kInVCCView goToStartView={this.props.goToStartView}/>;
    	case InvestmentRecommendationType.INVEST_ALL_IN_LP:
      	return <InvestAllInLPView goToStartView={this.props.goToStartView}/>;
      default:
      	return <ErrorView goToStartView={this.props.goToStartView}/>;
    }
  }
});

var ErrorView = React.createClass({
	  render() {
    	return (
      	<div>
          <div className='container'>
            <div className='row text-center'>
              Whoops.. not sure how you got here.
            </div>
            <div className='row text-center'>
              <br/>
            </div>
            <div className='row text-center'>
              <button type='button' className='btn btn-primary' onClick={this.props.goToStartView}>Finish</button>
            </div>
          </div>
      	</div>
      );
    }
});

var InvestUpTo800kInVCCView = React.createClass({
	  render() {
    	return (
      	<div>
          <div className='container'>
            <div className='row text-center'>
              You should invest up to $800k in a VCC.
            </div>
            <div className='row text-center'>
              <br/>
            </div>
            <div className='row text-center'>
              <button type='button' className='btn btn-primary' onClick={this.props.goToStartView}>Finish</button>
            </div>
          </div>
      	</div>
      );
    }
});

var InvestSomeInVCCSomeInLPRemainingInCGEView = React.createClass({
	  render() {
    	return (
      	<div>
          <div className='container'>
            <div className='row text-center'>
              You should invest your capital in a VCC but should consider some investment into an LP to use the CGE.
            </div>
            <div className='row text-center'>
              <br/>
            </div>
            <div className='row text-center'>
              <button type='button' className='btn btn-primary' onClick={this.props.goToStartView}>Finish</button>
            </div>
          </div>
      	</div>
      );
    }
});

var InvestAllInVCCView = React.createClass({
	  render() {
    	return (
      	<div>
          <div className='container'>
            <div className='row text-center'>
              You should invest all your available capital in a VCC.
            </div>
            <div className='row text-center'>
              <br/>
            </div>
            <div className='row text-center'>
              <button type='button' className='btn btn-primary' onClick={this.props.goToStartView}>Finish</button>
            </div>
          </div>
      	</div>
      );
    }
});

var InvestAllInLPView = React.createClass({
	  render() {
    	return (
      	<div>
          <div className='container'>
            <div className='row text-center'>
              You should invest all your available capital in an LP.
            </div>
            <div className='row text-center'>
              <br/>
            </div>
            <div className='row text-center'>
              <button type='button' className='btn btn-primary' onClick={this.props.goToStartView}>Finish</button>
            </div>
          </div>
      	</div>
      );
    }
});

var RemainingCapitalGainsAmountQuestion = React.createClass({

  getInitialState() {
    return ( { remainingCapitalGainsAmount : '0' } );
  },

  handleChange(e) {
    this.setState( {remainingCapitalGainsAmount : e.target.value } );
  },

  handleSubmit() {
    this.props.updateQuestionAnswer({remainingCapitalGainsAmount:this.state.remainingCapitalGainsAmount});
    this.props.goToNextView();
  },

  handleGoPrevious(){
    this.props.goToPreviousView();
  },

  render() {
    return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          How much of your remaining Capital Gains Exemption amount do you have remaining?
        </div>
        <div className='row text-center'>
          Remaining Capital Gains Exemption Amount $ : <input type="text" value={this.state.remainingCapitalGainsAmount} onChange={this.handleChange} />
        </div>
        <div className='row text-center'>
          <br/>
        </div>
        <div className='row text-center'>
          <button type='button' className='btn btn-primary' onClick={this.handleGoPrevious}>Previous Question</button>
          <button type='button' className='btn btn-primary' onClick={this.handleSubmit}>Next Question</button>
        </div>
      </div>
    </div>
    );
  }
});

var InvestmentEntityTypeQuestion = React.createClass({

  getInitialState() {
    return ( { investmentEntityType : InvestmentEntityType.PERSONAL_INVESTOR } );
  },

  handleChange(e) {
    this.setState( {investmentEntityType : e.target.value } );
  },

  handleSubmit() {
    this.props.updateQuestionAnswer({investmentEntityType:this.state.investmentEntityType});
    this.props.goToNextView();
  },

  handleGoPrevious(){
    this.props.goToPreviousView();
  },

  render() {
    return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          What type of investment entity will be making the investment?
        </div>
        <div className="radio">
          <label>
            <input type="radio"
                   checked={this.state.investmentEntityType == InvestmentEntityType.PERSONAL_INVESTOR}
                   value={InvestmentEntityType.PERSONAL_INVESTOR}
                   onChange={this.handleChange} />
                   Personal investor
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio"
                   checked={this.state.investmentEntityType == InvestmentEntityType.CORPORATE_INVESTOR}
                   value={InvestmentEntityType.CORPORATE_INVESTOR}
                   onChange={this.handleChange} />
                   Corporate investor
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio"
                   checked={this.state.investmentEntityType == InvestmentEntityType.TRUST_INVESTOR}
                   value={InvestmentEntityType.TRUST_INVESTOR}
                   onChange={this.handleChange} />
                   Trust investor
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio"
                   checked={this.state.investmentEntityType == InvestmentEntityType.FOUNDATION_INVESTOR}
                   value={InvestmentEntityType.FOUNDATION_INVESTOR}
                   onChange={this.handleChange} />
                   Foundation investor
          </label>
        </div>
        <div className='row text-center'>
          <br/>
        </div>
        <div className='row text-center'>
          <button type='button' className='btn btn-primary' onClick={this.handleGoPrevious}>Previous Question</button>
          <button type='button' className='btn btn-primary' onClick={this.handleSubmit}>Next Question</button>
        </div>
      </div>
    </div>
    );
  }
});

var RiskProfileQuestion = React.createClass({

  getInitialState() {
    return ( { riskProfile : RiskProfile.LOW_RISK } );
  },

  handleChange(e) {
    this.setState( {riskProfile : e.target.value } );
  },

  handleSubmit() {
    this.props.updateQuestionAnswer({riskProfile:this.state.riskProfile});
    this.props.goToNextView();
  },

  handleGoPrevious(){
      this.props.goToPreviousView();
  },

  render() {
    return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          How would you prefer to manage your risk using tax strategies?
        </div>
        <div className="radio">
          <label>
            <input type="radio"
                   checked={this.state.riskProfile == RiskProfile.LOW_RISK}
                   value={RiskProfile.LOW_RISK}
                   onChange={this.handleChange} />
                   A guaranteed return of up to 30% using Approved Investor Tax Credits.
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio"
                   checked={this.state.riskProfile == RiskProfile.HIGH_RISK}
                   value={RiskProfile.HIGH_RISK}
                   onChange={this.handleChange} />
                   Other tax strategies that leverage capital gains tax rates.
          </label>
        </div>
        <div className='row text-center'>
          <br/>
        </div>
        <div className='row text-center'>
          <button type='button' className='btn btn-primary' onClick={this.handleGoPrevious}>Previous Question</button>
          <button type='button' className='btn btn-primary' onClick={this.handleSubmit}>Next Question</button>
        </div>
      </div>
    </div>
    );
  }
});


var CapitalAmountQuestion = React.createClass({

  getInitialState() {
    return ( { capitalAmount : '0' } );
  },

  handleChange(e) {
    this.setState( {capitalAmount : e.target.value } );
  },

  handleSubmit() {
    this.props.updateQuestionAnswer({capitalAmount:this.state.capitalAmount});
    this.props.goToNextView();
  },

  render() {
    return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          How much capital are you considering investing?
        </div>
        <div className='row text-center'>
          Capital Amount $ : <input type="text" value={this.state.capitalAmount} onChange={this.handleChange} />
        </div>
        <div className='row text-center'>
          <br/>
        </div>
        <div className='row text-center'>
          <button type='button' className='btn btn-primary' onClick={this.handleSubmit}>Next Question</button>
        </div>
      </div>
    </div>
    );
  }
});

var Start = React.createClass({
  render() {
    return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          Should you invest in a Venture Capital Corporaton (VCC) or a Limited Partnership (LP)?
        </div>
        <div className='row text-center'>
          <br/>
        </div>
        <div className='row text-center'>
          <button type='button' className='btn btn-primary' onClick={this.props.goToNextView}>Answer A Few Questions</button>
        </div>
        <div className='row text-center'>
          <br/>
        </div>
        <div className='row text-center'>
          <button type='button' className='btn btn-primary' onClick={this.props.runTests}>Run Tests</button>
        </div>
      </div>
    </div>
    );
  }
});

var InvestmentRecommendation = function (capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount) {
		this.capitalAmount = capitalAmount;
    this.riskProfile = riskProfile;
    this.investmentEntityType = investmentEntityType;
    this.remainingCapitalGainsAmount = remainingCapitalGainsAmount;
    this.investmentRecommendation = -1;

		this.recommend = function () {

      /*var isLowRisk = this.riskProfile == RiskProfile.LOW_RISK;
      var isLowCaptial = this.captialAmount < 800000;
      var isPersonalInvestor = this.investmentEntityType == InvestmentEntityType.PERSONAL_INVESTOR;
      var hasRemainingCaptialGains = this.remainingCapitalGainsAmount > 0;
      this.investmentRecommendation = (isLowRisk) ? (isLowCaptial) ? (isPersonalInvestor && hasRemainingCaptialGains) ? InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE : InvestmentRecommendationType.INVEST_ALL_IN_VCC : InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K  : InvestmentRecommendationType.INVEST_ALL_IN_LP;*/
  		if(this.capitalAmount < 800000) {
      	this.recommendForLowCapitalInvestor();
      } else {
      	this.recommendForHighCaptialInvestor();
      }
      return this;
    };

    this.recommendForHighCaptialInvestor = function() {
			if(this.riskProfile == RiskProfile.LOW_RISK) {
      	this.recommendForHighCapitalAndLowRiskInvestor();
    	} else {
      	this.recommendForHighCapitalAndHighRiskInvestor();
      }
    };

    this.recommendForHighCapitalAndLowRiskInvestor = function() {
    	this.investmentRecommendation = InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K;
    };

    this.recommendForHighCapitalAndHighRiskInvestor = function() {
    	this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_LP;
    };

    this.recommendForLowCapitalInvestor = function() {
			if(this.riskProfile == RiskProfile.LOW_RISK) {
      	this.recommendForLowCapitalAndLowRiskInvestor();
    	} else {
      	this.recommendForLowCapitalAndHighRiskInvestor();
      }
    };

    this.recommendForLowCapitalAndHighRiskInvestor = function() {
    	this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_LP;
    };

    this.recommendForLowCapitalAndLowRiskInvestor = function() {
			if(this.investmentEntityType == InvestmentEntityType.PERSONAL_INVESTOR) {
				this.recommendForLowCapitalAndLowRiskAndPersonalInvestorType();
      }
      else {
      	this.recommendForLowCapitalAndLowRiskAndNonPersonalInvestorType();
    	}
    };

    this.recommendForLowCapitalAndLowRiskAndNonPersonalInvestorType = function() {
    	this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_VCC;
    };

    this.recommendForLowCapitalAndLowRiskAndPersonalInvestorType = function() {
	   	if(this.remainingCapitalGainsAmount > 0) {
				this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithCapitalGainsRemaining();
      } else {
				this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithNoCapitalGainsRemaining();
      }
    };

    this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithNoCapitalGainsRemaining = function() {
  	   	this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_VCC;
    };

    this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithCapitalGainsRemaining = function() {
  	   	this.investmentRecommendation = InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE;
    };

    this.recommendation = function() {
    	return this.investmentRecommendation;
    };
};

var Test = React.createClass({

runTest(testToRun) {
	try {
  	testToRun();
  	return <div className='row text-center'>Pass: {testToRun.name}</div>
  } catch(err) {
  	return <div className='row text-center'>Fail: {testToRun.name} Err: {err}</div>
  }
},

investmentLessThan800kLowRiskPersonalNoCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_VCC);
},

investmentLessThan800kLowRiskPersonalHasCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE);
},

investmentLessThan800kLowRiskCorporateNoCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_VCC);
},

investmentLessThan800kLowRiskCorporateHasCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_VCC);
},

investmentLessThan800kHighRiskPersonalHasNoCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

investmentLessThan800kHighRiskPersonalHasCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

investmentLessThan800kHighRiskCorporateHasNoCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

investmentLessThan800kHighRiskCorporateHasCaptialGains() {
  	// assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

investmentMoreThan800kLowRiskPersonalHasCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
},

investmentMoreThan800kLowRiskPersonalHasNoCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
},

investmentMoreThan800kLowRiskCorporateHasCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
},

investmentMoreThan800kLowRiskCorporateHasNoCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
},

investmentMoreThan800kHighRiskPersonalHasCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

investmentMoreThan800kHighRiskPersonalHasNoCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

investmentMoreThan800kHighRiskCorporateHasCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

investmentMoreThan800kHighRiskCorporateHasNoCaptialGains() {
  	// assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount,riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

		// assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
},

assertEquals(actual, expected) {
	if(actual == expected) {
  	return;
  }
  throw "error actual: " + actual + " not equal to expected: " + expected;
},

passTest() {

},

render() {
		return (
    <div>
      <div className='container'>
      { this.runTest(this.investmentLessThan800kLowRiskPersonalNoCaptialGains) }
      { this.runTest(this.investmentLessThan800kLowRiskPersonalHasCaptialGains) }
      { this.runTest(this.investmentLessThan800kLowRiskCorporateNoCaptialGains) }
      { this.runTest(this.investmentLessThan800kHighRiskPersonalHasNoCaptialGains) }
      { this.runTest(this.investmentLessThan800kHighRiskPersonalHasCaptialGains) }
      { this.runTest(this.investmentLessThan800kHighRiskCorporateHasNoCaptialGains) }
      { this.runTest(this.investmentLessThan800kHighRiskCorporateHasCaptialGains) }
      { this.runTest(this.investmentMoreThan800kLowRiskPersonalHasCaptialGains) }
      { this.runTest(this.investmentMoreThan800kLowRiskPersonalHasNoCaptialGains) }
      { this.runTest(this.investmentMoreThan800kLowRiskCorporateHasCaptialGains) }
      { this.runTest(this.investmentMoreThan800kLowRiskCorporateHasNoCaptialGains) }
      { this.runTest(this.investmentMoreThan800kHighRiskPersonalHasCaptialGains) }
      { this.runTest(this.investmentMoreThan800kHighRiskPersonalHasNoCaptialGains) }
      { this.runTest(this.investmentMoreThan800kHighRiskCorporateHasCaptialGains) }
      { this.runTest(this.investmentMoreThan800kHighRiskCorporateHasNoCaptialGains) }
      </div>
    </div>
    );
  }
});

ReactDOM.render(React.createElement(Main), document.getElementById('impl'));
