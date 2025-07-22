import moment from "moment";
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) =>{
  if(!name) return "";
  const words = name.split(" ");
  let initials ="";
  for(let i=0;i<Math.min(words.length,2);++i){
    initials+=words[i][0];
  } 
  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");

  const lastThree = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);

  let formattedInteger = "";

  if (otherDigits !== "") {
    formattedInteger =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    formattedInteger = lastThree;
  }

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map(item => ({
    category: item?.category,
    amount: item?.amount,
  }));
  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const chartData = sortedData.map((item) => ({
    category: moment(item?.date).format('Do MMM'), // ✅ Use "category"
    amount: item?.amount,
    source: item?.source,
  }));
  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("YYYY-MM-DD"), 
    amount: item?.amount,
    category: item?.category,
  }));
  return chartData;
};

