import axios from 'axios'

const testEndpoint = async () => {
  const testUserIds = [
    'test123', 'test456', 'test789', 
    'alice', 'bob', 'charlie',
    'user001', 'user002', 'user003',
    'random123', 'demo456'
  ]

  let successCount = 0
  let failCount = 0

  console.log('Testing track endpoint with multiple userIds...\n')

  for (const userId of testUserIds) {
    try {
      const response = await axios.get(`http://localhost:3001/api/track?userId=${userId}`)
      console.log(`✅ ${userId}: ${response.data.title} - ${response.data.artist}`)
      successCount++
    } catch (error: any) {
      console.log(`❌ ${userId}: ${error.response?.data?.error || 'Failed'}`)
      failCount++
    }
  }

  console.log(`\n--- Results ---`)
  console.log(`Success: ${successCount}/${testUserIds.length}`)
  console.log(`Failed: ${failCount}/${testUserIds.length}`)
  console.log(`Success rate: ${((successCount / testUserIds.length) * 100).toFixed(1)}%`)
}

testEndpoint()