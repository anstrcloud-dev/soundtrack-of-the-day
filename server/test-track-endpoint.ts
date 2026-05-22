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
  const readings: string[] = []

  console.log('Testing track endpoint with multiple userIds...\n')
  console.log('='.repeat(100))

  for (const userId of testUserIds) {
    try {
      const response = await axios.get(`http://localhost:3001/api/track?userId=${userId}`)
      console.log(`\n👤 User: ${userId}`)
      console.log(`   🎵 Track: "${response.data.title}" by ${response.data.artist}`)
      console.log(`   🔮 Reading: ${response.data.reading}`)
      console.log('-'.repeat(100))
      
      readings.push(response.data.reading)
      successCount++
    } catch (error: any) {
      console.log(`\n❌ ${userId}: ${error.response?.data?.error || 'Failed'}`)
      console.log('-'.repeat(100))
      failCount++
    }
  }

  console.log(`\n${'='.repeat(100)}`)
  console.log(`--- Results ---`)
  console.log(`Success: ${successCount}/${testUserIds.length}`)
  console.log(`Failed: ${failCount}/${testUserIds.length}`)
  console.log(`Success rate: ${((successCount / testUserIds.length) * 100).toFixed(1)}%`)
  
  // Check for variety in readings
  console.log(`\n--- Reading Variety Analysis ---`)
  const startsWithWhispers = readings.filter(r => r.toLowerCase().startsWith('whispers')).length
  const startsWithEchoes = readings.filter(r => r.toLowerCase().startsWith('echoes')).length
  const startsWithShadows = readings.filter(r => r.toLowerCase().startsWith('shadows')).length
  
  console.log(`Readings starting with "Whispers": ${startsWithWhispers}/${readings.length}`)
  console.log(`Readings starting with "Echoes": ${startsWithEchoes}/${readings.length}`)
  console.log(`Readings starting with "Shadows": ${startsWithShadows}/${readings.length}`)
  
  if (startsWithWhispers > readings.length / 2) {
    console.log(`⚠️  WARNING: More than half of readings start with "Whispers" - need more variety!`)
  } else {
    console.log(`✅ Good variety in reading openings!`)
  }
}

testEndpoint()