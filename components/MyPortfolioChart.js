import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '@/library/theme';
import { SIZING } from '@/library/sizing';
import { Line, Doughnut } from 'react-chartjs-2';
import { MyPortfolioChartCurrentBalanceSpan, MyPortfolioChartCurrentBalanceNumber,
MyPortfolioChartDollarSignSpan } from '@/library/typography';
import { MdArrowDropDownCircle } from "react-icons/md";


const MyPortfolioChart = ({total_invesment_amount , nftData}) => {

  const [selectedItem, setSelectedItem] = useState('Chart'); 

  const handleToggle = (item) => {
    setSelectedItem(selectedItem === 'Chart' ? 'Allocation' : 'Chart');
  };

  const chartData = {
    labels: ['Nov 26', 'Nov 27', 'Nov 28', 'Nov 29', 'Nov 30', 'Dec 1'],
    datasets: [
      {
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(11, 110, 79, 0.1)',
        borderColor: COLORS.DartmouthGreen900Default,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: COLORS.DartmouthGreen900Default,
        pointBackgroundColor: COLORS.DartmouthGreen800,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: COLORS.DartmouthGreen800,
        pointHoverBorderColor: COLORS.DartmouthGreen800,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [0, 0, 0, 0, 0, total_invesment_amount], 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }      
    },
  };

  const allocationData = {
    labels: nftData.map(object => object.name),
    datasets: [
      {
        borderWidth: 0,
        data: nftData.map(object => ((Number(object.BOTinvesmentAmount)/(total_invesment_amount*10**18))*100).toFixed(2)),
        backgroundColor: [COLORS.PigmentGreen900, COLORS.PigmentGreen800, COLORS.PigmentGreen700Default],
        fill: false,
        pointBackgroundColor: '#e6194b'
      },
    ],
  };

  const allocationOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ${value}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: 'transparent', 
                  fontColor: COLORS.Black100,   
                                 
                };
              });
            }
            return [];
          },

          usePointStyle: true, 
          font: {
            size: 20, 
          },
          padding: 30, // You can adjust the value as needed

      },
      },

    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    cutout: 70,
    
    
  };


  const randomPercentage = Math.round((Math.random() * 200) - 50)/100;
  const isNegativePercentage = Boolean(randomPercentage < 0);

  const changeInAmount = total_invesment_amount * randomPercentage;
  const isNegativeChange = Boolean(changeInAmount < 0);

  return (
    <Section>

      <MyPortfolioChartCurrentBalanceSpan>
        Current Balance
      </MyPortfolioChartCurrentBalanceSpan>

      <FullSpanRow>

        <CurrentBalanceRow>
          <MyPortfolioChartCurrentBalanceNumber>
            <MyPortfolioChartDollarSignSpan>
              $&nbsp;
            </MyPortfolioChartDollarSignSpan>
            {total_invesment_amount.toFixed(8)}
          </MyPortfolioChartCurrentBalanceNumber>
          <ChangeInPercentage isNegative={isNegativePercentage}>
            <ChangeInPercentageIcon isNegative={isNegativePercentage}/>
            {randomPercentage} %
          </ChangeInPercentage>
        </CurrentBalanceRow>

        <ToggleRow>
          {selectedItem === 'Chart' ? (
            <SelectedItem>
              Chart
            </SelectedItem>
          ) : (
            <UnselectedItem onClick={() => handleToggle('Chart')}>
              Chart
            </UnselectedItem>
          )}
          
          {selectedItem === 'Allocation' ? (
            <SelectedItem>
              Allocation
            </SelectedItem>
          ) : (
            <UnselectedItem onClick={() => handleToggle('Allocation')}>
              Allocation
            </UnselectedItem>
          )}
        </ToggleRow>
      </FullSpanRow>

      
      <ChangeInAmountRow isNegative={isNegativeChange}>
        {isNegativeChange ? '- ' : '+ '}${Math.abs(changeInAmount).toFixed(2)}
        <TwentyFourHours>
          24h
        </TwentyFourHours>
      </ChangeInAmountRow>

      {selectedItem === 'Chart' && (
        <ChartWrapper>
          <Line data={chartData} options={chartOptions} />
        </ChartWrapper>
      )}

      {selectedItem === 'Allocation' && (
        <AllocationChartWrapper>
          <Doughnut data={allocationData} options={allocationOptions}/>
        </AllocationChartWrapper>
      )}
      
    </Section>
  );
};

const Section = styled.section`
display: flex
flex-direction: column;
padding: ${SIZING.px24} ${SIZING.px24};
background-color: ${COLORS.Black875};
border-radius: ${SIZING.px16};  
`

const CurrentBalanceRow = styled.div`
display: flex;
align-items: center;
gap: ${SIZING.px16};
`
const ChangeInPercentage = styled.div`
display: flex;
align-items: center;
padding: ${SIZING.px8} ${SIZING.px16};
gap: ${SIZING.px8};
font-size: ${SIZING.px16};
letter-spacing: -0.02rem;
color: ${props => (props.isNegative ? COLORS.PersianRed100 : COLORS.DartmouthGreen100)};
font-family: "Uncut Sans Semibold";
background-color: ${props => (props.isNegative ? COLORS.PersianRed600Default : COLORS.DartmouthGreen900Default)};
border-radius: ${SIZING.px96};
`
const ChangeInPercentageIcon = styled(MdArrowDropDownCircle)`
font-size: ${SIZING.px16};
fill: ${props => (props.isNegative ? COLORS.PersianRed100 : COLORS.DartmouthGreen100)};
transform: ${props => (props.isNegative ? 'rotate(0deg)' : 'rotate(180deg)')};
`
const ChangeInAmountRow = styled.div`
display: flex;
align-items: center;
margin-top: ${SIZING.px16};
margin-bottom: ${SIZING.px20};
gap: ${SIZING.px8};
font-size: ${SIZING.px14};
font-family: "Uncut Sans Semibold";
color: ${props => (props.isNegative ? COLORS.PersianRed600Default : COLORS.PigmentGreen600)};
`
const TwentyFourHours = styled.div`
padding: ${SIZING.px6} ${SIZING.px8};
font-size: ${SIZING.px10};
letter-spacing: -0.0125rem;
font-family: "Uncut Sans Medium";
color: ${COLORS.Black200};
background-color: ${COLORS.Black800};
border-radius: ${SIZING.px96};
`
const FullSpanRow = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
margin-top: ${SIZING.px4};
`
const ToggleRow = styled.div`
display: flex;
align-items: center;
padding: ${SIZING.px4};
gap: ${SIZING.px4};
background-color: ${COLORS.Black850};
border: 1px solid ${COLORS.Black800};
border-radius: ${SIZING.px96};
`
const SelectedItem = styled.div`
padding: ${SIZING.px8} ${SIZING.px16};
background-color: ${COLORS.Black800};
border-radius: ${SIZING.px96};
`
const UnselectedItem = styled.span`
padding: ${SIZING.px8} ${SIZING.px16};
border-radius: ${SIZING.px96};
transition: 0.2s ease-in-out;
cursor: pointer;

&:hover{
background-color: ${COLORS.Black800};
}
`

const ChartWrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%; 
height: ${SIZING.px416};
`

const AllocationChartWrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%; 
height: ${SIZING.px416};
`

export default MyPortfolioChart

