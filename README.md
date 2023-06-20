# B-WaterSmart - Short-Term Demand Forecasting Tool

This repository contains the frontend that was developed as a part of the [B-WaterSmart](https://b-watersmart.eu/) project. The [backend component](https://github.com/iwwtech/bws-stdft) can be found in a separate repository.

## Overview

The B-WaterSmart Short-Term Demand Forecasting Tool is a comprehensive project designed to assist users in predicting water consumption and making informed decisions regarding resource management. It consists of three main sections: Meter Management, Model Management, and Forecast Creation.

- **Meter Management**: Create virtual meters from physical meters, access meter information, and delete virtual meters.
- **Model Management**: Create models based on meters and algorithms, view information about available models, and delete models.
- **Forecast Creation**: Generate forecasts for meters using selected algorithms.

### Meter Management

In the Meter Management section, users can create virtual meters from physical meters, providing a flexible and efficient way to monitor water consumption. They can easily associate physical meters with corresponding virtual meters, enabling accurate data tracking and analysis. Users can efficiently manage their water resources by identifying consumption trends, detecting anomalies, and taking appropriate measures for conservation.

### Model Management

The Model Management section empowers users to create forecasting models based on historical meter data. By selecting a specific meter and algorithm, users can generate accurate predictions of water demand. The tool offers a variety of algorithms tailored for different scenarios, allowing users to choose the most suitable one for their needs. Additionally, the system incorporates advanced techniques such as machine learning and statistical analysis to enhance the accuracy and reliability of the models. Users can optimize the model parameters through hyperparameter tuning or manually adjust them to achieve the desired level of precision. With the ability to create and manage multiple models, users can explore different approaches and compare their performance for informed decision-making.

### Forecast Creation

The Forecast Creation section leverages the generated models to produce reliable forecasts of water consumption. Users can input relevant variables such as time periods, environmental factors, or specific events to obtain accurate predictions tailored to their requirements. The tool utilizes historical data, algorithmic insights, and other contextual information to generate forecasts that account for various factors affecting water demand. These forecasts enable users to anticipate future consumption patterns, plan resources effectively, and develop strategies for optimal water management. By leveraging the forecasting capabilities of the tool, users can proactively respond to changing demands, ensure resource availability, and promote sustainable water usage practices.

### Getting Started

1.  Install Docker
2.  Clone the repository
3.  Modify the .env file according to your needs:
    - Change the REACT_APP_API_URL to your desired API URL.
4.  Modify docker-compose.yml to your needs
5.  Run one of the two below commands:

```
// For development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

// For production
docker compose -f docker-compose.yml up --build
```
