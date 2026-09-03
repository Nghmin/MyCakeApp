/**
 * Chuyển đổi dateRange enum/string thành điều kiện query theo mốc thời gian cho Prisma (gte - greater than or equal)
 * @param {string} dateRange - Một trong các giá trị: 'ALL', 'TODAY', '7_DAYS', '30_DAYS'
 * @returns { { gte: Date } | undefined }
 */
export const getDateFilter = (dateRange) => {
  if (!dateRange || dateRange === 'ALL') return undefined;

  const now = new Date();
  let startDate = new Date();

  switch (dateRange) {
    case 'TODAY':
      startDate.setHours(0, 0, 0, 0); // Bắt đầu từ 00:00:00 hôm nay
      break;
    case '7_DAYS':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30_DAYS':
      startDate.setDate(now.getDate() - 30);
      break;
    default:
      return undefined;
  }

  return { gte: startDate };
};