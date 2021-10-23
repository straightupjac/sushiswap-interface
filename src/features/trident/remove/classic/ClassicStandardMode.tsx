import React, { FC } from 'react'
import Typography from '../../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import ListPanel from '../../../../components/ListPanel'
import PercentInput from '../../../../components/Input/Percent'
import Button from '../../../../components/Button'
import ToggleButtonGroup from '../../../../components/ToggleButton'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  attemptingTxnAtom,
  currentLiquidityValueSelector,
  outputToWalletAtom,
  poolBalanceAtom,
  showReviewAtom,
} from '../../context/atoms'
import { Percent } from '@sushiswap/core-sdk'
import { useTridentRouterContract } from '../../../../hooks'
import Lottie from 'lottie-react'
import loadingCircle from '../../../../animation/loading-circle.json'
import TridentApproveGate from '../../TridentApproveGate'
import AssetInput from '../../../../components/AssetInput'
import Dots from '../../../../components/Dots'
import usePercentageInput from '../../context/hooks/usePercentageInput'
import SumUSDCValues from '../../SumUSDCValues'

const ClassicUnstandardMode: FC = () => {
  const { i18n } = useLingui()
  const router = useTridentRouterContract()
  const {
    percentageInput: [percentageInput, setPercentageInput],
    parsedAmounts,
    error,
  } = usePercentageInput()

  const currentLiquidityValue = useRecoilValue(currentLiquidityValueSelector)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const [outputToWallet, setOutputToWallet] = useRecoilState(outputToWalletAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  const toggleButtonGroup = (
    <ToggleButtonGroup value={percentageInput} onChange={setPercentageInput} variant="outlined">
      <ToggleButtonGroup.Button value="100">Max</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="75">75%</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="50">50%</ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="25">25%</ToggleButtonGroup.Button>
    </ToggleButtonGroup>
  )

  return (
    <SumUSDCValues amounts={currentLiquidityValue}>
      {({ amount }) => {
        const selectedLiquidityValueInUsdc = amount?.multiply(new Percent(percentageInput, '100'))
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between gap-10 items-center lg:mb-2">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  Amount to Remove:
                </Typography>
                <div className="flex-1 hidden lg:block">{toggleButtonGroup}</div>
              </div>
              <ListPanel
                header={
                  <ListPanel.Header
                    title={i18n._(t`Balances`)}
                    value={`$${amount ? amount.toSignificant(6) : '0.0000'}`}
                    subValue={`${poolBalance ? poolBalance.toSignificant(6) : '0.0000'} SLP`}
                  />
                }
                items={[
                  currentLiquidityValue.map((el, index) => <ListPanel.CurrencyAmountItem amount={el} key={index} />),
                ]}
                footer={
                  <div className="flex justify-between items-center px-4 py-5 gap-3">
                    <PercentInput
                      value={percentageInput}
                      onUserInput={setPercentageInput}
                      placeholder="0%"
                      className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow font-bold text-high-emphesis"
                    />
                    <Typography variant="sm" className="text-low-emphesis" weight={700}>
                      ≈$
                      {selectedLiquidityValueInUsdc?.greaterThan('0')
                        ? selectedLiquidityValueInUsdc?.toSignificant(6)
                        : '0.0000'}
                    </Typography>
                  </div>
                }
              />
              <div className="block lg:hidden">{toggleButtonGroup}</div>
              <TridentApproveGate
                inputAmounts={[poolBalance?.multiply(new Percent(percentageInput, '100'))]}
                tokenApproveOn={router?.address}
              >
                {({ approved, loading }) => {
                  const disabled = !!error || !approved || loading || attemptingTxn
                  const buttonText = attemptingTxn ? (
                    <Dots>{i18n._(t`Withdrawing`)}</Dots>
                  ) : loading ? (
                    ''
                  ) : error ? (
                    error
                  ) : (
                    i18n._(t`Review and Confirm`)
                  )

                  return (
                    <Button
                      {...(loading && {
                        startIcon: (
                          <div className="w-4 h-4 mr-1">
                            <Lottie animationData={loadingCircle} autoplay loop />
                          </div>
                        ),
                      })}
                      color={approved ? 'gradient' : 'blue'}
                      disabled={disabled}
                      onClick={() => setShowReview(true)}
                    >
                      <Typography
                        variant="sm"
                        weight={700}
                        className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}
                      >
                        {buttonText}
                      </Typography>
                    </Button>
                  )
                }}
              </TridentApproveGate>
            </div>
            <div className="flex flex-col gap-5 block lg:hidden">
              <div className="flex justify-between gap-3">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {i18n._(t`Receive:`)}
                </Typography>
                <AssetInput.WalletSwitch onChange={() => setOutputToWallet(!outputToWallet)} checked={outputToWallet} />
              </div>

              <div className="flex flex-col gap-4">
                <ListPanel
                  items={[parsedAmounts.map((el, index) => <ListPanel.CurrencyAmountItem amount={el} key={index} />)]}
                  footer={
                    <div className="flex justify-between px-4 py-3.5 bg-dark-800">
                      <Typography weight={700} className="text-high-emphesis">
                        {i18n._(t`Total Amount`)}
                      </Typography>
                      <Typography weight={700} className="text-high-emphesis text-right">
                        ≈$
                        {selectedLiquidityValueInUsdc?.greaterThan('0')
                          ? selectedLiquidityValueInUsdc?.toSignificant(6)
                          : '0.0000'}
                      </Typography>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        )
      }}
    </SumUSDCValues>
  )
}

export default ClassicUnstandardMode