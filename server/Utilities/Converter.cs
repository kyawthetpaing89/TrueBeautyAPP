using Dapper;

namespace server.Utilities
{
    public class Converter
    {
        public static DynamicParameters DtoToParam<T>(T model)
        {
            var parameters = new DynamicParameters();

            foreach (var property in typeof(T).GetProperties())
            {
                var value = property.GetValue(model);

                // If the property is a string and is null or whitespace, treat it as null
                if (property.PropertyType == typeof(string) && string.IsNullOrWhiteSpace(value as string))
                {
                    value = null;
                }

                parameters.Add($"@{property.Name}", value);
            }

            return parameters;
        }
    }
}