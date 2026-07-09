/**
 * Context Loader
 * Loads user profile and static database records for prompt context.
 * DOES NOT implement Hindsight yet.
 */

import Kisan from '../../models/Kisan.js';
import Scan from '../../models/Scan.js';

export const loadUserContext = async (kisanId) => {
  try {
    const user = await Kisan.findById(kisanId).select('-pin -__v').lean();
    if (!user) {
      return { error: "User not found" };
    }

    // Load recent scans to give the agent context of what diseases the user recently faced
    const recentScans = await Scan.find({ kisanId }).sort({ scannedAt: -1 }).limit(3).lean();

    return {
      kisanId,
      profile: {
        name: user.name,
        village: user.village,
        district: user.district,
        state: user.state,
        cropTypes: user.cropTypes || [],
        landSize: user.landSize,
        irrigationMethod: user.irrigationMethod,
        farmingType: user.farmingType
      },
      recentScans: recentScans.map(s => ({
        crop: s.cropName,
        disease: s.diseaseName,
        status: s.healthStatus,
        date: s.scannedAt
      }))
    };
  } catch (error) {
    console.error("Context Loader Error:", error);
    return { error: "Failed to load user context" };
  }
};
