  # Build stage
  FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
  WORKDIR /src

  # Restore dependencies
  COPY Api.csproj .
  RUN dotnet restore Api.csproj

  # Copy source and publish
  COPY . .
  RUN dotnet publish Api.csproj -c Release -o /app/publish

  # Runtime stage
  FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
  WORKDIR /app
  COPY --from=build /app/publish .

  ENV ASPNETCORE_URLS=http://+:${API_PORT:-5000}
  EXPOSE ${API_PORT:-5000}

  ENTRYPOINT ["dotnet", "Api.dll"]
