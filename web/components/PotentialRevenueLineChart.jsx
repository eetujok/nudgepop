import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { api } from '../api';
import { useFindMany, useFindFirst } from "@gadgetinc/react";
import AnalyticsGrid from "./AnalyticsGrid.jsx";
import { BlockStack, Text, Divider, Spinner } from "@shopify/polaris"

const PotentialRevenueLineChart = ({ shopId }) => {

    const [{ data: pixel, fetching: fetchingPixel, error: errorFetchingPixel }] = useFindMany(api.popupActivationPixel, {
      filter: {
        AND: [
          { shopId:  { equals: shopId } }, { popupCheckoutPixel: { isSet: true } }
        ]
      },
      select: {
        popupCheckoutPixel: {
          id: true,
          totalPrice: true,
          createdAt: true
        }
    }

  });

    const [{ data: emailRecords, fetching: fetchingEmailRecords, error: errorFetchingEmailRecords }] = useFindFirst(api.shopifyShop, {
      filter: {id: { equals: shopId }},
      select: {
        totalEmails: true,
      }
    })
  
  console.log("Seetext: emailRecords", emailRecords)

  const rawData = pixel?.map(p => p.popupCheckoutPixel.totalPrice) || [];
  const labels = pixel?.map(p => p.popupCheckoutPixel.createdAt.substring(0,10)) || [];

  const cumulateSum = (data) => {
    let cumulativeData = [];
    data.reduce((acc, value, index) => cumulativeData[index] = acc + value, 0);
    return cumulativeData;
  }

  const aggregateData = (labels, data) => {
    let aggregatedData = {};
    labels.forEach((label, index) => {
      if (aggregatedData[label]) {
        aggregatedData[label] += data[index];
      } else {
        aggregatedData[label] = data[index];
      }
    });
    let uniqueLabels = Object.keys(aggregatedData);
    let summedData = Object.values(aggregatedData);
    return { uniqueLabels, summedData };
  }

  const sum = rawData.reduce((partialSum, a) => partialSum + a, 0);
  const { uniqueLabels, summedData } = aggregateData(labels, rawData);

  const chartData = {
    labels: uniqueLabels,
    datasets: [{
      label: "Revenue saved",
      data: cumulateSum(summedData),
      fill: true,
      borderColor: 'rgb(0, 128, 0)',
      fillColor: 'rgb(0, 128, 0)',
      tension: 0.1
    }],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            return '$' + value;
          }
        }
      }
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItems, data) {
          return "$" + tooltipItems.yLabel.toString();
        }
      }
    }
  }

  if (fetchingPixel || fetchingEmailRecords) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }
  return (
    <BlockStack gap="800" align="space-around">
      <AnalyticsGrid totalValue={sum ?? 0} totalConversions={pixel?.length ?? 0} totalEmails={emailRecords.totalEmails} />
      <Text as="p" variant="bodyMd">Potential revenue calculated by the cumulative sum of order values after popup activation has lead to checkout.</Text>
      {rawData.length > 0 && (
        <BlockStack gap="800" align="space-around">
          <Divider />
          <Text as="h2" variant="headingMd">Revenue saved over time</Text>
          <Chart
            type="line"
            data={chartData}
            options={chartOptions}
            />
        </BlockStack>
      )}
    </BlockStack>

  )
};

export default PotentialRevenueLineChart;
