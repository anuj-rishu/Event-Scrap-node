const axios = require("axios");
const logger = require("../Utils/logger");

const getHackathons = async (req, res) => {
  try {
    const { page = 1, region, teamsize } = req.query;

    const response = await axios.get(
      "https://unstop.com/api/public/opportunity/search-result",
      {
        params: {
          opportunity: "hackathons",
          page: page,
          per_page: 18,
          oppstatus: "open",
          region: region || "",
          teamsize: teamsize || "",
          undefined: true,
        },
        headers: {
          accept: "application/json, text/plain, */*",
          "user-agent": "Mozilla/5.0",
          referer: "https://unstop.com/hackathons",
          token: req.sessionToken,
        },
      },
    );

    const rawData = response.data?.data || {};
    const list = rawData.data || [];
    const totalCount = rawData.total || 0;

    const formatted = list.map((item) => {
      const min = item.regnRequirements?.min_team_size || "";
      const max = item.regnRequirements?.max_team_size || "";

      const location = item.address_with_country_logo
        ? `${item.address_with_country_logo.address}, ${item.address_with_country_logo.city}, ${item.address_with_country_logo.state}, ${item.address_with_country_logo.country?.name}`
        : "Online";

      return {
        title: item.title,
        id: item.short_id,
        college: item.organisation?.name,
        members: `${min} - ${max} Members`,
        location,
        posted: item.approved_date,
        days_left: item.regnRequirements?.remain_days,
        link: item.seo_url,
        image: item.logoUrl2,
      };
    });

    res.json({
      page: Number(page),
      total: totalCount,
      per_page: rawData.per_page || 18,
      hackathons: formatted,
    });
  } catch (err) {
    logger.error(JSON.stringify(err.response?.data) || err.message);
    res.status(500).json({ error: "Failed to fetch hackathons" });
  }
};

module.exports = {
  getHackathons,
};
