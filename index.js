(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ViewState = {
  START: 1,
  CAPITAL_AMOUNT_QUESTION: 2,
  RISK_QUESTION: 3,
  INVESTMENT_ENTITY_TYPE_QUESTION: 4,
  REMAINING_CAPITAL_GAINS_AMOUNT_QUESTION: 5,
  SUMMARY: 6,
  END: 7,
  TEST: 8
};

var RiskProfile = {
  LOW_RISK: 1,
  HIGH_RISK: 2
};

var InvestmentEntityType = {
  PERSONAL_INVESTOR: 1,
  CORPORATE_INVESTOR: 2,
  TRUST_INVESTOR: 3,
  FOUNDATION_INVESTOR: 4
};

var InvestmentRecommendationType = {
  INVEST_ALL_IN_VCC: 1,
  INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE: 2,
  INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K: 3,
  INVEST_ALL_IN_LP: 4
};

var Main = React.createClass({
  displayName: 'Main',
  getInitialState: function getInitialState() {
    return { currentViewState: ViewState.START, questionAnswers: {} };
  },
  runTests: function runTests() {
    this.setState({ currentViewState: ViewState.TEST });
  },
  goToNextView: function goToNextView() {
    var currentViewState = this.state.currentViewState;
    if (currentViewState === ViewState.END) {
      this.setState({ currentViewState: ViewState.START });
      return;
    }
    this.setState({ currentViewState: currentViewState + 1 });
  },
  goToPreviousView: function goToPreviousView() {
    var currentViewState = this.state.currentViewState;
    if (currentViewState === ViewState.START) {
      this.setState({ currentViewState: ViewState.START });
      return;
    }
    this.setState({ currentViewState: currentViewState - 1 });
  },
  goToStartView: function goToStartView() {
    this.setState({ currentViewState: ViewState.START });
  },
  updateQuestionAnswer: function updateQuestionAnswer(questionAnswer) {
    var newQuestionAnswers = Object.assign({}, this.state.questionAnswers, questionAnswer);
    this.setState({ questionAnswers: newQuestionAnswers });
  },
  render: function render() {
    switch (this.state.currentViewState) {
      case ViewState.START:
        return React.createElement(Start, { goToNextView: this.goToNextView, runTests: this.runTests });
      case ViewState.CAPITAL_AMOUNT_QUESTION:
        return React.createElement(CapitalAmountQuestion, { goToNextView: this.goToNextView, updateQuestionAnswer: this.updateQuestionAnswer });
      case ViewState.RISK_QUESTION:
        return React.createElement(RiskProfileQuestion, { goToPreviousView: this.goToPreviousView, goToNextView: this.goToNextView, updateQuestionAnswer: this.updateQuestionAnswer });
      case ViewState.INVESTMENT_ENTITY_TYPE_QUESTION:
        return React.createElement(InvestmentEntityTypeQuestion, { goToPreviousView: this.goToPreviousView, goToNextView: this.goToNextView, updateQuestionAnswer: this.updateQuestionAnswer });
      case ViewState.REMAINING_CAPITAL_GAINS_AMOUNT_QUESTION:
        return React.createElement(RemainingCapitalGainsAmountQuestion, { goToPreviousView: this.goToPreviousView, goToNextView: this.goToNextView, updateQuestionAnswer: this.updateQuestionAnswer });
      case ViewState.SUMMARY:
        return React.createElement(Summary, { goToStartView: this.goToStartView, data: this.state.questionAnswers });
      case ViewState.TEST:
        return React.createElement(Test, null);
      default:
        return React.createElement(Start, { goToNextView: this.goToNextView });
    }
  }
});

var Summary = React.createClass({
  displayName: 'Summary',
  render: function render() {
    var capitalAmount = this.props.data.capitalAmount;
    var riskProfile = this.props.data.riskProfile;
    var investmentEntityType = this.props.data.investmentEntityType;
    var remainingCapitalGainsAmount = this.props.data.remainingCapitalGainsAmount;

    var investorRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount).recommend().recommendation();

    switch (investorRecommendation) {
      case InvestmentRecommendationType.INVEST_ALL_IN_VCC:
        return React.createElement(InvestAllInVCCView, { goToStartView: this.props.goToStartView });
      case InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE:
        return React.createElement(InvestSomeInVCCSomeInLPRemainingInCGEView, { goToStartView: this.props.goToStartView });
      case InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K:
        return React.createElement(InvestUpTo800kInVCCView, { goToStartView: this.props.goToStartView });
      case InvestmentRecommendationType.INVEST_ALL_IN_LP:
        return React.createElement(InvestAllInLPView, { goToStartView: this.props.goToStartView });
      default:
        return React.createElement(ErrorView, { goToStartView: this.props.goToStartView });
    }
  }
});

var ErrorView = React.createClass({
  displayName: 'ErrorView',
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'Whoops.. not sure how you got here.'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.props.goToStartView },
            'Finish'
          )
        )
      )
    );
  }
});

var InvestUpTo800kInVCCView = React.createClass({
  displayName: 'InvestUpTo800kInVCCView',
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'You should invest up to $800k in a VCC.'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.props.goToStartView },
            'Finish'
          )
        )
      )
    );
  }
});

var InvestSomeInVCCSomeInLPRemainingInCGEView = React.createClass({
  displayName: 'InvestSomeInVCCSomeInLPRemainingInCGEView',
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'You should invest your capital in a VCC but should consider some investment into an LP to use the CGE.'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.props.goToStartView },
            'Finish'
          )
        )
      )
    );
  }
});

var InvestAllInVCCView = React.createClass({
  displayName: 'InvestAllInVCCView',
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'You should invest all your available capital in a VCC.'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.props.goToStartView },
            'Finish'
          )
        )
      )
    );
  }
});

var InvestAllInLPView = React.createClass({
  displayName: 'InvestAllInLPView',
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'You should invest all your available capital in an LP.'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.props.goToStartView },
            'Finish'
          )
        )
      )
    );
  }
});

var RemainingCapitalGainsAmountQuestion = React.createClass({
  displayName: 'RemainingCapitalGainsAmountQuestion',
  getInitialState: function getInitialState() {
    return { remainingCapitalGainsAmount: '0' };
  },
  handleChange: function handleChange(e) {
    this.setState({ remainingCapitalGainsAmount: e.target.value });
  },
  handleSubmit: function handleSubmit() {
    this.props.updateQuestionAnswer({ remainingCapitalGainsAmount: this.state.remainingCapitalGainsAmount });
    this.props.goToNextView();
  },
  handleGoPrevious: function handleGoPrevious() {
    this.props.goToPreviousView();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'How much of your remaining Capital Gains Exemption amount do you have remaining?'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          'Remaining Capital Gains Exemption Amount $ : ',
          React.createElement('input', { type: 'text', value: this.state.remainingCapitalGainsAmount, onChange: this.handleChange })
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.handleGoPrevious },
            'Previous Question'
          ),
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.handleSubmit },
            'Next Question'
          )
        )
      )
    );
  }
});

var InvestmentEntityTypeQuestion = React.createClass({
  displayName: 'InvestmentEntityTypeQuestion',
  getInitialState: function getInitialState() {
    return { investmentEntityType: InvestmentEntityType.PERSONAL_INVESTOR };
  },
  handleChange: function handleChange(e) {
    this.setState({ investmentEntityType: e.target.value });
  },
  handleSubmit: function handleSubmit() {
    this.props.updateQuestionAnswer({ investmentEntityType: this.state.investmentEntityType });
    this.props.goToNextView();
  },
  handleGoPrevious: function handleGoPrevious() {
    this.props.goToPreviousView();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'What type of investment entity will be making the investment?'
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio',
              checked: this.state.investmentEntityType == InvestmentEntityType.PERSONAL_INVESTOR,
              value: InvestmentEntityType.PERSONAL_INVESTOR,
              onChange: this.handleChange }),
            'Personal investor'
          )
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio',
              checked: this.state.investmentEntityType == InvestmentEntityType.CORPORATE_INVESTOR,
              value: InvestmentEntityType.CORPORATE_INVESTOR,
              onChange: this.handleChange }),
            'Corporate investor'
          )
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio',
              checked: this.state.investmentEntityType == InvestmentEntityType.TRUST_INVESTOR,
              value: InvestmentEntityType.TRUST_INVESTOR,
              onChange: this.handleChange }),
            'Trust investor'
          )
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio',
              checked: this.state.investmentEntityType == InvestmentEntityType.FOUNDATION_INVESTOR,
              value: InvestmentEntityType.FOUNDATION_INVESTOR,
              onChange: this.handleChange }),
            'Foundation investor'
          )
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.handleGoPrevious },
            'Previous Question'
          ),
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.handleSubmit },
            'Next Question'
          )
        )
      )
    );
  }
});

var RiskProfileQuestion = React.createClass({
  displayName: 'RiskProfileQuestion',
  getInitialState: function getInitialState() {
    return { riskProfile: RiskProfile.LOW_RISK };
  },
  handleChange: function handleChange(e) {
    this.setState({ riskProfile: e.target.value });
  },
  handleSubmit: function handleSubmit() {
    this.props.updateQuestionAnswer({ riskProfile: this.state.riskProfile });
    this.props.goToNextView();
  },
  handleGoPrevious: function handleGoPrevious() {
    this.props.goToPreviousView();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'How would you prefer to manage your risk using tax strategies?'
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio',
              checked: this.state.riskProfile == RiskProfile.LOW_RISK,
              value: RiskProfile.LOW_RISK,
              onChange: this.handleChange }),
            'A guaranteed return of up to 30% using Approved Investor Tax Credits.'
          )
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio',
              checked: this.state.riskProfile == RiskProfile.HIGH_RISK,
              value: RiskProfile.HIGH_RISK,
              onChange: this.handleChange }),
            'Other tax strategies that leverage capital gains tax rates.'
          )
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.handleGoPrevious },
            'Previous Question'
          ),
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.handleSubmit },
            'Next Question'
          )
        )
      )
    );
  }
});

var CapitalAmountQuestion = React.createClass({
  displayName: 'CapitalAmountQuestion',
  getInitialState: function getInitialState() {
    return { capitalAmount: '0' };
  },
  handleChange: function handleChange(e) {
    this.setState({ capitalAmount: e.target.value });
  },
  handleSubmit: function handleSubmit() {
    this.props.updateQuestionAnswer({ capitalAmount: this.state.capitalAmount });
    this.props.goToNextView();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'How much capital are you considering investing?'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          'Capital Amount $ : ',
          React.createElement('input', { type: 'text', value: this.state.capitalAmount, onChange: this.handleChange })
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.handleSubmit },
            'Next Question'
          )
        )
      )
    );
  }
});

var Start = React.createClass({
  displayName: 'Start',
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row text-center' },
          'Should you invest in a Venture Capital Corporaton (VCC) or a Limited Partnership (LP)?'
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.props.goToNextView },
            'Answer A Few Questions'
          )
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement('br', null)
        ),
        React.createElement(
          'div',
          { className: 'row text-center' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary', onClick: this.props.runTests },
            'Run Tests'
          )
        )
      )
    );
  }
});

var InvestmentRecommendation = function InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount) {
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
    if (this.capitalAmount < 800000) {
      this.recommendForLowCapitalInvestor();
    } else {
      this.recommendForHighCaptialInvestor();
    }
    return this;
  };

  this.recommendForHighCaptialInvestor = function () {
    if (this.riskProfile == RiskProfile.LOW_RISK) {
      this.recommendForHighCapitalAndLowRiskInvestor();
    } else {
      this.recommendForHighCapitalAndHighRiskInvestor();
    }
  };

  this.recommendForHighCapitalAndLowRiskInvestor = function () {
    this.investmentRecommendation = InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K;
  };

  this.recommendForHighCapitalAndHighRiskInvestor = function () {
    this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_LP;
  };

  this.recommendForLowCapitalInvestor = function () {
    if (this.riskProfile == RiskProfile.LOW_RISK) {
      this.recommendForLowCapitalAndLowRiskInvestor();
    } else {
      this.recommendForLowCapitalAndHighRiskInvestor();
    }
  };

  this.recommendForLowCapitalAndHighRiskInvestor = function () {
    this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_LP;
  };

  this.recommendForLowCapitalAndLowRiskInvestor = function () {
    if (this.investmentEntityType == InvestmentEntityType.PERSONAL_INVESTOR) {
      this.recommendForLowCapitalAndLowRiskAndPersonalInvestorType();
    } else {
      this.recommendForLowCapitalAndLowRiskAndNonPersonalInvestorType();
    }
  };

  this.recommendForLowCapitalAndLowRiskAndNonPersonalInvestorType = function () {
    this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_VCC;
  };

  this.recommendForLowCapitalAndLowRiskAndPersonalInvestorType = function () {
    if (this.remainingCapitalGainsAmount > 0) {
      this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithCapitalGainsRemaining();
    } else {
      this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithNoCapitalGainsRemaining();
    }
  };

  this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithNoCapitalGainsRemaining = function () {
    this.investmentRecommendation = InvestmentRecommendationType.INVEST_ALL_IN_VCC;
  };

  this.recommendForLowCapitalAndLowRiskAndPersonalInvestorTypeWithCapitalGainsRemaining = function () {
    this.investmentRecommendation = InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE;
  };

  this.recommendation = function () {
    return this.investmentRecommendation;
  };
};

var Test = React.createClass({
  displayName: 'Test',
  runTest: function runTest(testToRun) {
    try {
      testToRun();
      return React.createElement(
        'div',
        { className: 'row text-center' },
        'Pass: ',
        testToRun.name
      );
    } catch (err) {
      return React.createElement(
        'div',
        { className: 'row text-center' },
        'Fail: ',
        testToRun.name,
        ' Err: ',
        err
      );
    }
  },
  investmentLessThan800kLowRiskPersonalNoCaptialGains: function investmentLessThan800kLowRiskPersonalNoCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_VCC);
  },
  investmentLessThan800kLowRiskPersonalHasCaptialGains: function investmentLessThan800kLowRiskPersonalHasCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_REMAINING_CGE);
  },
  investmentLessThan800kLowRiskCorporateNoCaptialGains: function investmentLessThan800kLowRiskCorporateNoCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_VCC);
  },
  investmentLessThan800kLowRiskCorporateHasCaptialGains: function investmentLessThan800kLowRiskCorporateHasCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_VCC);
  },
  investmentLessThan800kHighRiskPersonalHasNoCaptialGains: function investmentLessThan800kHighRiskPersonalHasNoCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  investmentLessThan800kHighRiskPersonalHasCaptialGains: function investmentLessThan800kHighRiskPersonalHasCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  investmentLessThan800kHighRiskCorporateHasNoCaptialGains: function investmentLessThan800kHighRiskCorporateHasNoCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  investmentLessThan800kHighRiskCorporateHasCaptialGains: function investmentLessThan800kHighRiskCorporateHasCaptialGains() {
    // assemble
    var capitalAmount = 600000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  investmentMoreThan800kLowRiskPersonalHasCaptialGains: function investmentMoreThan800kLowRiskPersonalHasCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
  },
  investmentMoreThan800kLowRiskPersonalHasNoCaptialGains: function investmentMoreThan800kLowRiskPersonalHasNoCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
  },
  investmentMoreThan800kLowRiskCorporateHasCaptialGains: function investmentMoreThan800kLowRiskCorporateHasCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
  },
  investmentMoreThan800kLowRiskCorporateHasNoCaptialGains: function investmentMoreThan800kLowRiskCorporateHasNoCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.LOW_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_SOME_IN_VCC_SOME_IN_LP_UP_TO_800K);
  },
  investmentMoreThan800kHighRiskPersonalHasCaptialGains: function investmentMoreThan800kHighRiskPersonalHasCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  investmentMoreThan800kHighRiskPersonalHasNoCaptialGains: function investmentMoreThan800kHighRiskPersonalHasNoCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.PERSONAL_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  investmentMoreThan800kHighRiskCorporateHasCaptialGains: function investmentMoreThan800kHighRiskCorporateHasCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 100000;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  investmentMoreThan800kHighRiskCorporateHasNoCaptialGains: function investmentMoreThan800kHighRiskCorporateHasNoCaptialGains() {
    // assemble
    var capitalAmount = 1000000;
    var riskProfile = RiskProfile.HIGH_RISK;
    var investmentEntityType = InvestmentEntityType.CORPORATE_INVESTOR;
    var remainingCapitalGainsAmount = 0;

    var investmentRecommendation = new InvestmentRecommendation(capitalAmount, riskProfile, investmentEntityType, remainingCapitalGainsAmount);

    // act
    investmentRecommendation.recommend();

    // assert
    this.assertEquals(investmentRecommendation.recommendation(), InvestmentRecommendationType.INVEST_ALL_IN_LP);
  },
  assertEquals: function assertEquals(actual, expected) {
    if (actual == expected) {
      return;
    }
    throw "error actual: " + actual + " not equal to expected: " + expected;
  },
  passTest: function passTest() {},
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        this.runTest(this.investmentLessThan800kLowRiskPersonalNoCaptialGains),
        this.runTest(this.investmentLessThan800kLowRiskPersonalHasCaptialGains),
        this.runTest(this.investmentLessThan800kLowRiskCorporateNoCaptialGains),
        this.runTest(this.investmentLessThan800kHighRiskPersonalHasNoCaptialGains),
        this.runTest(this.investmentLessThan800kHighRiskPersonalHasCaptialGains),
        this.runTest(this.investmentLessThan800kHighRiskCorporateHasNoCaptialGains),
        this.runTest(this.investmentLessThan800kHighRiskCorporateHasCaptialGains),
        this.runTest(this.investmentMoreThan800kLowRiskPersonalHasCaptialGains),
        this.runTest(this.investmentMoreThan800kLowRiskPersonalHasNoCaptialGains),
        this.runTest(this.investmentMoreThan800kLowRiskCorporateHasCaptialGains),
        this.runTest(this.investmentMoreThan800kLowRiskCorporateHasNoCaptialGains),
        this.runTest(this.investmentMoreThan800kHighRiskPersonalHasCaptialGains),
        this.runTest(this.investmentMoreThan800kHighRiskPersonalHasNoCaptialGains),
        this.runTest(this.investmentMoreThan800kHighRiskCorporateHasCaptialGains),
        this.runTest(this.investmentMoreThan800kHighRiskCorporateHasNoCaptialGains)
      )
    );
  }
});

ReactDOM.render(React.createElement(Main), document.getElementById('impl'));

},{}]},{},[1]);
