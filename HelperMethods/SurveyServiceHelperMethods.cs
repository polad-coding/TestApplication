using KPProject.Models;
using System;
using System.Collections.Generic;

namespace KPProject.HelperMethods
{
    public class SurveyServiceHelperMethods
    {
        /// <summary>
        /// Generates the random seed for the survey, so that the user starting the first stage of the survey will get the values shuffled in the same pseudo-random order.
        /// </summary>
        /// <returns></returns>
        public static int GenerateRandomSeed()
        {
            Random r = new Random();

            var seed = r.Next();

            return seed;
        }
        public static void Shuffle(List<ValueModel> values, int seed)
        {
            var rng = new Random(seed);
            int l = values.Count;

            while (l > 1)
            {
                l--;
                int randomIndex = rng.Next(l + 1);
                ValueModel value = values[randomIndex];
                values[randomIndex] = values[l];
                values[l] = value;
            }
        }

    }
}
