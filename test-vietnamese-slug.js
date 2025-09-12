// Test Vietnamese slug generation
console.log('Testing Vietnamese slug generation:');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    // Convert Vietnamese characters to ASCII equivalents
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    // Remove any remaining special characters (keep only letters, numbers, spaces, hyphens)
    .replace(/[^a-z0-9 -]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    .trim();
};

// Test cases
const testCases = [
  'Lập trình JavaScript cơ bản',
  'Hướng dẫn học ReactJS từ đầu',
  'Phương pháp học lập trình hiệu quả',
  'Tạo ứng dụng web với Next.js',
  'Cách sử dụng MongoDB trong Node.js',
  'Học TypeScript cho người mới bắt đầu',
  'Xây dựng API RESTful với Express',
  'Vietnamese Characters: áàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ'
];

testCases.forEach(testCase => {
  console.log(`"${testCase}" -> "${generateSlug(testCase)}"`);
});
